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
import Util from "@helpers/Util";


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
            // console.log(user)
            let isAdmin = user.roles.find(x => x.description == RolesHandler.admin);
            let isCRP = user.crp; //user.roles.find(x => x.description == RolesHandler.crp);
            if (isAdmin) {
                const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                    `
                    SELECT
                        DISTINCT (name), description, primary_field, qa_indicators.order AS indicator_order
                    FROM
                        qa_indicators
                    ORDER BY 
                        indicator_order ASC
                    `,
                    {},
                    {}
                );
                const indicators = await queryRunner.connection.query(query, parameters);
                for (let index = 0; index < indicators.length; index++) {
                    response.push({ indicator: indicators[index] });

                }
                res.status(200).json({ data: response, message: "User indicators" });
                return;
            }
            else if (isCRP) {
                const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                    `
                    SELECT DISTINCT
                    (
                        evaluations.indicator_view_name
                    ),
                    evaluations.crp_id,
                    (
                        SELECT
                            indicators.name
                        FROM
                            qa_indicators indicators
                        WHERE
                            view_name = evaluations.indicator_view_name
                    ) as name,
                    (
                        SELECT
                        indicators.order
                        FROM
                            qa_indicators indicators
                        WHERE
                            view_name = evaluations.indicator_view_name
                    ) as indicator_order,
                    (
                        SELECT
                            primary_field
                        FROM
                            qa_indicators
                        WHERE
                            view_name = evaluations.indicator_view_name
                    ) as primary_field,
                    meta.enable_crp AS enable_crp
                    FROM
                        qa_evaluations evaluations
                    LEFT JOIN qa_comments_meta meta ON meta.indicatorId = (
                        SELECT
                            id
                        FROM
                            qa_indicators
                        WHERE
                            view_name = evaluations.indicator_view_name
                    )
                    WHERE
                        evaluations.crp_id = :crp_id
                    ORDER BY 
                        indicator_order ASC
                    `,
                    { crp_id: user.crp.crp_id },
                    {}
                );
                const indicators = await queryRunner.connection.query(query, parameters);
                res.status(200).json({ data: indicators, message: "CRP indicators" });
                return;
            }
            else {

                const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                    `
                    SELECT
                        indicators.name AS name,
                        indicators.description AS description,
                        indicators.primary_field AS primary_field,
                        indicators.order AS indicator_order,
                        meta.enable_assessor as enable_assessor
                    FROM
                        qa_indicator_user qa_indicator_user
                    LEFT JOIN qa_indicators indicators ON indicators.id = qa_indicator_user.indicatorId
                    LEFT JOIN qa_comments_meta meta ON meta.indicatorId = qa_indicator_user.indicatorId
                    WHERE
                        qa_indicator_user.userId = :userId 
                    ORDER BY 
                        indicator_order ASC`,
                    { userId: id },
                    {}
                );
                let indicators = await queryRunner.connection.query(query, parameters);
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
                let indicatorMeta = await Util.createMetaForIndicator(indicator, indicator.primary_field);
                //If all ok, send 200 response
                res.status(200).json({ message: "Indicator created", data: { indicator, indicatorMeta } });
                return;
            }
        } catch (e) {
            res.status(409).json({ message: "Indicator already in use" });
            return;
        }

        // //If all ok, send 200 response
        res.status(401).json({ message: "Something wrong." });
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
            Util.createMetaForIndicator(indicator, primary_field);
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
                // res_ = await Util.createEvaluations(userbyIndicator, selectedIndicator);
                // console.log("res_", res_)
                res.status(200).json({ message: "Indicator by user saved", data: res_ })
                res.status(200).json({ message: "Indicator by user saved", data: userbyIndicator })

            } catch (e) {
                res.status(409).json({ message: "Indicator by user not saved" });
                return;
            }

            // res.status(200).json({ message: "Indicator by user saved", data:hasAssignedIndicators })
        }




    }

}

export default IndicatorsController;