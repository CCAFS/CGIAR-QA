import { Request, Response, response } from "express";
import { getRepository, createQueryBuilder, getConnection } from "typeorm";
import { validate } from "class-validator";

import { QAUsers } from "@entity/User";
import { QAIndicators } from "@entity/Indicators";
import { QAIndicatorUser } from "@entity/IndicatorByUser";
import { QAEvaluations } from "@entity/Evaluations";
import { QAIndicatorsMeta } from "@entity/IndicatorsMeta";
import { QACommentsMeta } from "@entity/CommentsMeta";

import { StatusHandler } from "@helpers/StatusHandler"
import { RolesHandler } from "@helpers/RolesHandler"


class IndicatorsController {

    /**
     * 
     * Indicators CRUD
     * 
     */


    static getAllIndicators = async (req: Request, res: Response) => {
        //Get indicators from database
        try {
            const indicatorRepository = getRepository(QAIndicators);
            const indicators = await indicatorRepository.find({});

            //Send the indicators object
            res.status(200).json({ data: indicators, message: "All indicators" });

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Could not access to indicators." });
        }
    };


    static getIndicatorsByUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
        let queryRunner = getConnection().createQueryBuilder();
        let response = []


        //Get user by id; if manager all indicators; 
        try {
            const userRepository = getRepository(QAUsers);
            let user = await userRepository.findOneOrFail({ where: { id } });
            let isAdmin = user.roles.find(x => x.description == RolesHandler.admin);
            if (isAdmin) {
                const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                    `
                    SELECT
                        DISTINCT (name), description, primary_field
                    FROM
                        qa_indicators
                    `,
                    {},
                    {}
                );
                const indicators =  await queryRunner.connection.query(query, parameters);
                for (let index = 0; index < indicators.length; index++) {
                    response.push({ indicator: indicators[index] });

                }
                res.status(200).json({ data: response, message: "User indicators" });
                return;
            } else {
                
                const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                    `
                    SELECT
                        indicators.name AS name,
                        indicators.description AS description,
                        indicators.primary_field AS primary_field,
                        meta.enable_assessor as enable_assessor
                    FROM
                        qa_indicator_user qa_indicator_user
                    LEFT JOIN qa_indicators indicators ON indicators.id = qa_indicator_user.indicatorId
                    LEFT JOIN qa_comments_meta meta ON meta.indicatorId = qa_indicator_user.indicatorId
                    WHERE
                        qa_indicator_user.userId = :userId `,
                    { userId: id },
                    {}
                );
                let indicators =  await queryRunner.connection.query(query, parameters);
                for (let index = 0; index < indicators.length; index++) {
                    response.push({ indicator: indicators[index] });

                }

                //Send the indicators object
                res.status(200).json({ data: response, message: "User indicators" });

            }

            // console.log(userRole.roles)

        } catch (error) {
            console.log(error);
            res.status(200).json({ data: [], message: "User indicators." });
        }




        //Get indicators from database
        // try {
        // const indicators = await indicatorRepository.find({});
        // const indicators = await indicatorByUserRepository.find({
        //     relations: ["indicator"],
        //     where: { user: id },
        //     select: ["id", 'indicator']
        // });

        // console.log(indicators)

        // //Send the indicators object
        // res.status(200).json({ data: indicators, message: "User indicators" });

        // } catch (error) {
        //     console.log(error);
        //     res.status(404).json({ message: "Could not access to indicators." });
        // }
    }

    static createIndicator = async (req: Request, res: Response) => {

        let { name, description, view_name, primary_field } = req.body;

        let indicator = new QAIndicators();
        indicator.name = name;
        indicator.description = description;
        indicator.view_name = view_name;
        indicator.primary_field = primary_field;

        //Validade if the parameters are ok
        const errors = await validate(indicator);
        if (errors.length > 0) {
            res.status(400).json({ data: errors, message: "Error found" });
            return;
        }
        const indicatorRepository = getRepository(QAIndicators);

        //Get indicators from database
        try {
            indicator = await indicatorRepository.save(indicator);
            if (indicator.primary_field && indicator.primary_field !== " ") {
                IndicatorsController.createMetaForIndicator(indicator, indicator.primary_field);
            }
        } catch (e) {
            res.status(409).json({ message: "Indicator already in use" });
            return;
        }

        //If all ok, send 200 response
        res.status(200).json({ message: "Indicator created" });
    };

    static editIndicators = async (req: Request, res: Response) => {

        //Get the ID from the url
        const id = req.params.id;

        let { name, description, view_name, primary_field } = req.body;

        const indicatorRepository = getRepository(QAIndicators);
        let indicator;

        try {
            indicator = await indicatorRepository.findOneOrFail(id);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).json({ message: 'Indicator not found.' });
            // throw new ErrorHandler(404, 'User not found.');
        }

        indicator.name = name;
        indicator.description = description;
        indicator.view_name = view_name;

        if (primary_field && primary_field !== " ") {
            IndicatorsController.createMetaForIndicator(indicator, primary_field);
        }

        //Validade if the parameters are ok
        const errors = await validate(indicator);
        if (errors.length > 0) {
            res.status(400).json({ data: errors, message: "Error found" });
            return;
        }


        //Get indicators from database
        try {
            await indicatorRepository.save(indicator);
        } catch (e) {
            res.status(409).json({ message: "Indicator already in use" });
            return;
        }

        //If all ok, send 200 response
        res.status(200).json({ message: "Indicator updated" });
    };

    static deleteIndicators = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        const indicatorRepository = getRepository(QAIndicators);
        let indicator: QAIndicators;
        try {
            indicator = await indicatorRepository.findOneOrFail(id);
        } catch (error) {
            res.status(400).json({ message: 'Indicator not found.' });
        }
        indicatorRepository.delete(id);

        //After all send a 204 (no content, but accepted) response
        res.status(200).json({ message: "Indicator deleted sucessfully" });
    };

    static assignIndicatorToUser = async (req: Request, res: Response) => {
        let { user_id, indicator_id, crpId } = req.body;

        const userRepository = getRepository(QAUsers);
        const indicatorRepository = getRepository(QAIndicators);
        const indicatorbyUsrRepository = getRepository(QAIndicatorUser);
        const evaluationsRepository = getRepository(QAEvaluations);

        let selectedUser, selectedIndicator, hasAssignedIndicators = null;

        if (crpId && indicator_id === null) {
            selectedUser = await userRepository.findOneOrFail(user_id);

            try {
                hasAssignedIndicators = await evaluationsRepository.createQueryBuilder("qa_evaluations")
                    .select('indicators.id AS indicatorId')
                    .leftJoin(`qa_indicators`, 'indicators', 'indicators.view_name = qa_evaluations.indicator_view_name')
                    .groupBy('indicator_view_name')
                    .getRawMany();

                let savePromises = [];
                // let crpIndicators = hasAssignedIndicators.map((data) => { return data.indicatorId })
                for (let index = 0; index < hasAssignedIndicators.length; index++) {
                    const element = hasAssignedIndicators[index];
                    let userbyIndicator = new QAIndicatorUser();
                    userbyIndicator.user = selectedUser;
                    userbyIndicator.indicator = element.indicatorId;

                    savePromises.push(userbyIndicator);

                }
                let res_ = await indicatorbyUsrRepository.save(savePromises);
                // console.log(hasAssignedIndicators)
                res.status(200).json({ message: "Indicator by user saved", data: res_ })
            } catch (error) {
                console.log(error)
            }

        } else {

            try {
                selectedUser = await userRepository.findOneOrFail(user_id);
                selectedIndicator = await indicatorRepository.findOneOrFail(indicator_id);
                hasAssignedIndicators = await indicatorbyUsrRepository.createQueryBuilder('qa_indicator_user')
                    .where('qa_indicator_user.userId=:userId', { userId: user_id })
                    .andWhere('qa_indicator_user.indicatorId=:indicatorId', { indicatorId: indicator_id })
                    .getMany();

                if (hasAssignedIndicators.length > 0) {
                    res.status(200).json({ message: "Indicator already assigned to user", data: selectedIndicator })
                    return;
                }

            } catch (error) {
                console.log(error)
                res.status(404).json({ message: "User / Indicator not found" });
                return;
            }

            let userbyIndicator = new QAIndicatorUser();
            userbyIndicator.user = selectedUser;
            userbyIndicator.indicator = selectedIndicator;
            let res_;
            try {
                userbyIndicator = await indicatorbyUsrRepository.save(userbyIndicator);
                res_ = await IndicatorsController.createEvaluations(userbyIndicator, selectedIndicator);
                // console.log("res_", res_)
                res.status(200).json({ message: "Indicator by user saved", data: res_ })

            } catch (e) {
                res.status(409).json({ message: "Indicator by user not saved" });
                return;
            }

            // res.status(200).json({ message: "Indicator by user saved", data:hasAssignedIndicators })
        }




    }



    static editCommentsMeta = async (req: Request, res: Response) => {

        //Get the ID from the url
        const id = req.params.id;

        let { enable_assessor, enable_crp } = req.body;

        console.log(enable_assessor, enable_crp)

        const commentMetaRepository = getRepository(QACommentsMeta);
        let commentMeta;

        try {
            commentMeta = await commentMetaRepository.createQueryBuilder('qa_comments_meta')
                .select('id, enable_crp, enable_assessor')
                .where("qa_comments_meta.indicatorId=:indicatorId", { indicatorId: id })
                // .getSql()
                .getRawOne()
            console.log(commentMeta)
            commentMeta.enable_assessor = enable_assessor ? enable_assessor : commentMeta.enable_assessor;
            commentMeta.enable_crp = enable_crp ? enable_crp : commentMeta.enable_crp;
            //Validade if the parameters are ok
            const errors = await validate(commentMeta);
            if (errors.length > 0) {
                res.status(400).json({ data: errors, message: "Error found" });
                return;
            }

            // update indicator by user
            commentMeta = await commentMetaRepository.save(commentMeta);

        } catch (error) {
            console.log(error)
            //If not found, send a 404 response
            res.status(404).json({ message: 'User indicator not found.', data: error });
            // throw new ErrorHandler(404, 'User not found.');
        }

        //If all ok, send 200 response
        res.status(200).json({ message: "User indicator updated", data: commentMeta });


    };

    /*****
     * 
     * Private functions
     * 
     *****/

    static createMetaForIndicator = async (indicator: QAIndicators, primary_field: string) => {
        let pols_meta = getConnection().getMetadata(indicator.view_name).ownColumns.map(column => column.propertyName);
        let primary = primary_field;

        const indicatorMetaRepository = getRepository(QAIndicatorsMeta);

        let savePromises = [];
        for (let index = 0; index < pols_meta.length; index++) {
            const element = pols_meta[index];

            const indicator_meta = new QAIndicatorsMeta();
            indicator_meta.col_name = element;
            indicator_meta.display_name = element.split("_").join(" ");
            indicator_meta.enable_comments = true;
            indicator_meta.include_detail = true;
            indicator_meta.include_general = true;
            indicator_meta.indicator = indicator;

            indicator_meta.is_primay = (element == primary) ? true : false;
            savePromises.push(indicator_meta);

        }

        try {
            let response = await indicatorMetaRepository.save(savePromises);
            return response;
        } catch (error) {
            console.log(error);
            return false;
        }

    }

    static createEvaluations = async (indiByUsr: QAIndicatorUser, indicator: QAIndicators): Promise<any> => {
        const evaluationsRepository = getRepository(QAEvaluations);
        try {
            let evaluations = await evaluationsRepository.find({ where: { indicator_user: indiByUsr.id } });
            let response;
            if (evaluations.length > 0) {
                console.log("ddd")
                return [];
            } else {
                // console.log("Evaluations", indiByUsr.id, indicator.view_name, indicator.primary_field)
                let view_data = await createQueryBuilder(indicator.view_name)
                    //.getRawMany()
                    .getMany();
                // console.log("Evaluations", view_data.length)
                let savePromises = [];
                for (let index = 0; index < view_data.length; index++) {
                    let element = view_data[index];

                    const evaluations = new QAEvaluations();
                    evaluations.indicator_view_id = element[indicator.primary_field];
                    evaluations.indicator_view_name = indicator.view_name;
                    evaluations.crp_id = element['crp_id'];
                    evaluations.indicator_user = indiByUsr;
                    evaluations.status = StatusHandler.Pending;

                    // console.log(evaluations, element)

                    savePromises.push(evaluations);

                }

                // console.log(savePromises.length)
                response = await evaluationsRepository.save(savePromises);
                // //console.log("savePromises")
                // console.log(response.length)
            }
            // console.log(evaluations);
            return response;
        } catch (error) {
            console.log(error)
            return error;
        }
    }



}

export default IndicatorsController;