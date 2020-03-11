import { Request, Response } from "express";
import { getRepository, In } from "typeorm";

import { QAIndicatorUser } from "@entity/IndicatorByUser";
import { QACrp } from "@entity/CRP";
import { QAEvaluations } from "@entity/Evaluations";
import { QAUsers } from "@entity/User";
import { QAIndicators } from "@entity/Indicators";

import { StatusHandler } from "@helpers/StatusHandler";
import { DisplayTypeHandler } from "@helpers/DisplayTypeHandler";
import { RolesHandler } from "@helpers/RolesHandler";

// import { validate } from "class-validator";
// import { runInNewContext } from "vm";

class EvaluationsController {

    /**
     * 
     * Evaluations CRUD
     * 
     */

    // get evaluations dashboard by user
    static getEvaluationsDash = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        //Get evaluations from database
        try {
            const indicatorByUserRepository = getRepository(QAIndicatorUser);
            let rawData = await indicatorByUserRepository
                .createQueryBuilder("qa_indicator_user")
                .where("qa_indicator_user.user=:userId", { userId: id })
                .leftJoinAndSelect("qa_indicator_user.evaluations", "evaluations")
                .leftJoinAndSelect("qa_indicators", "indicator", "indicator.view_name =`evaluations`.`indicator_view_name`")
                .addSelect("`indicator`.primary_field AS primary_field")
                .addSelect("COUNT(evaluations.`status`)", "count")
                .groupBy("evaluations.`status`")
                .orderBy("evaluations.`status`", 'ASC')
                .addGroupBy("evaluations.`indicator_view_name`")
                .getRawMany();

            let response = []
            for (let index = 0; index < rawData.length; index++) {
                const element = rawData[index];
                response.push({
                    indicator_view_name: element['evaluations_indicator_view_name'],
                    status: element['evaluations_status'],
                    type: EvaluationsController.getType(element['evaluations_status']),
                    value: element['count'],
                    label: `${element['count']}`,
                    primary_field: element["primary_field"]
                    // total: element['sum'],
                })

            }


            let result = EvaluationsController.groupBy(response, 'indicator_view_name');
            // console.log(result)
            res.status(200).json({ data: result, message: "User evaluations" });
        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Could not access to evaluations." });
        }
    }

    // get evaluations LIST by user
    static getListEvaluationsDash = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
        const view_name = req.body.view_name;
        const view_primary_field = req.body.view_primary_field;



        // check if admin
        try {
            const userRepository = getRepository(QAUsers);
            let user = await userRepository.findOneOrFail({ where: { id } });
            let isAdmin = user.roles.find(x => x.description == RolesHandler.admin);
            if (isAdmin) {
                const indicatorByUserRepository = getRepository(QAIndicatorUser);
                let rawData = await indicatorByUserRepository
                    .createQueryBuilder("qa_indicator_user")
                    .select(`${view_name}.title AS title`)
                    .addSelect(`${view_name}.crp AS crp`)
                    .andWhere("evaluations.indicator_view_name=:view_name", { view_name })
                    .leftJoinAndSelect("qa_indicator_user.evaluations", "evaluations")
                    .leftJoinAndSelect(view_name, view_name, `${view_name}.${view_primary_field}= evaluations.indicator_view_id`)
                    .getRawMany();
                // .getSql();

                // console.log(rawData)
                res.status(200).json({ data: EvaluationsController.parseEvaluationsData(rawData), message: "User evaluations list" });
                return;
            }


        } catch (error) {
            console.log(error);
            res.status(200).json({ data: [], message: "User indicators." });
        }

        //Get evaluations from database
        try {
            const indicatorByUserRepository = getRepository(QAIndicatorUser);
            let rawData = await indicatorByUserRepository
                .createQueryBuilder("qa_indicator_user")
                .select(`${view_name}.title AS title`)
                .addSelect(`${view_name}.crp AS crp`)
                .where("qa_indicator_user.user=:userId", { userId: id })
                .andWhere("evaluations.indicator_view_name=:view_name", { view_name })
                .leftJoinAndSelect("qa_indicator_user.evaluations", "evaluations")
                .leftJoinAndSelect(view_name, view_name, `${view_name}.${view_primary_field}= evaluations.indicator_view_id`)
                .getRawMany();
            // .getSql();

            // console.log(rawData)
            res.status(200).json({ data: EvaluationsController.parseEvaluationsData(rawData), message: "User evaluations list" });
        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Could not access to evaluations." });
        }
    }


    // get detailed evaluation by user
    static getDetailedEvaluationDash = async (req: Request, res: Response) => {

        //Get the ID from the url
        const id = req.params.id;
        const view_name = `qa_${req.body.type}`;
        const view_name_psdo = `${req.body.type}`;
        const view_primary_field = req.body.primary_column;
        const indicatorId = req.body.indicatorId;

        //Get indicator item data from view
        try {
            const userRepository = getRepository(QAUsers);
            let user = await userRepository.findOneOrFail({ where: { id } });
            let isAdmin = user.roles.find(x => x.description == RolesHandler.admin);
            let rawData;
            if (isAdmin) {

                const indicatorByUserRepository = getRepository(QAIndicatorUser);
                rawData = await indicatorByUserRepository
                    .createQueryBuilder("qa_indicator_user")
                    .select(`${view_name_psdo}.title AS title`)
                    .addSelect(`${view_name_psdo}.crp AS crp`)
                    // .where("qa_indicator_user.user=:userId", { userId: id })
                    .andWhere("evaluations.indicator_view_id=:indicatorId", { indicatorId })
                    .andWhere("evaluations.indicator_view_name=:view_name", { view_name })
                    .leftJoinAndSelect("qa_indicator_user.evaluations", "evaluations")
                    .leftJoinAndSelect(view_name, view_name_psdo, `${view_name_psdo}.${view_primary_field}= evaluations.indicator_view_id`)
                    .leftJoinAndSelect("qa_indicators_meta", "meta", `meta.indicatorId= qa_indicator_user.indicatorId`)
                    .getRawMany();
                // .getSql();
            } else {
                const indicatorByUserRepository = getRepository(QAIndicatorUser);
                rawData = await indicatorByUserRepository
                    .createQueryBuilder("qa_indicator_user")
                    .select(`${view_name_psdo}.title AS title`)
                    .addSelect(`${view_name_psdo}.crp AS crp`)
                    .where("qa_indicator_user.user=:userId", { userId: id })
                    .andWhere("evaluations.indicator_view_id=:indicatorId", { indicatorId })
                    .andWhere("evaluations.indicator_view_name=:view_name", { view_name })
                    .leftJoinAndSelect("qa_indicator_user.evaluations", "evaluations")
                    .leftJoinAndSelect(view_name, view_name_psdo, `${view_name_psdo}.${view_primary_field}= evaluations.indicator_view_id`)
                    .leftJoinAndSelect("qa_indicators_meta", "meta", `meta.indicatorId= qa_indicator_user.indicatorId`)
                    .getRawMany();
                // .getSql();

            }











            // res.status(200).json({ data: (rawData), message: "User evaluation detail" });
            res.status(200).json({ data: EvaluationsController.parseEvaluationsData(rawData, view_name_psdo), message: "User evaluation detail" });
        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Could not access to evaluations." });
        }
    }





    // get all evaluations dashboard
    static getAllEvaluationsDash = async (req: Request, res: Response) => {

        let { crp_id } = req.query;
        try {
            const indicatorByUserRepository = getRepository(QAIndicatorUser);
            let rawData;
            if (crp_id !== undefined && crp_id !== "undefined") {
                rawData = await indicatorByUserRepository
                    .createQueryBuilder("qa_indicator_user")
                    .where("`evaluations`.`crp_id` = :crp_id", { crp_id: crp_id })
                    .leftJoinAndSelect("qa_indicator_user.evaluations", "evaluations")
                    .leftJoinAndSelect("qa_indicators", "indicator", "indicator.view_name =`evaluations`.`indicator_view_name`")
                    .addSelect("COUNT(evaluations.`status`)", "count")
                    .addSelect("`indicator`.primary_field AS primary_field")
                    .groupBy("evaluations.`status`")
                    .orderBy("evaluations.`status`", 'ASC')
                    .addGroupBy("evaluations.`indicator_view_name`")
                    // .getSql()
                    .getRawMany()

            } else {

                rawData = await indicatorByUserRepository
                    .createQueryBuilder("qa_indicator_user")
                    .leftJoinAndSelect("qa_indicator_user.evaluations", "evaluations")
                    .leftJoinAndSelect("qa_indicators", "indicator", "indicator.view_name =`evaluations`.`indicator_view_name`")
                    .addSelect("`indicator`.primary_field AS primary_field")
                    .addSelect("COUNT(evaluations.`status`)", "count")
                    .groupBy("evaluations.`status`")
                    .orderBy("evaluations.`status`", 'ASC')
                    .addGroupBy("evaluations.`indicator_view_name`")
                    // .getSql()
                    .getRawMany()
            }

            let response = []

            for (let index = 0; index < rawData.length; index++) {
                const element = rawData[index];
                response.push({
                    indicator_view_name: element['evaluations_indicator_view_name'],
                    status: element['evaluations_status'],
                    type: EvaluationsController.getType(element['evaluations_status']),
                    value: element['count'],
                    crp_id: (crp_id) ? element['evaluations_crp_id'] : null,
                    label: `${element['count']}`,
                    primary_field: element["primary_field"]
                })

            }

            let result = EvaluationsController.groupBy(response, 'indicator_view_name');
            res.status(200).json({ data: result, message: "All evaluations" });
        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Could not access to evaluations." });
        }

    }

    // get all CRPS
    static getCRPS = async (req: Request, res: Response) => {

        const crpRepository = await getRepository(QACrp);

        try {
            let allCRP = await crpRepository.find();
            res.status(200).json({ data: allCRP, message: "All CRPs" });
        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Could not get crp." });
        }

    }

    //get indicators by crp (admin dashboard)
    static getIndicatorsByCrp = async (req: Request, res: Response) => {
        const indiUserRepository = getRepository(QAIndicatorUser);
        // const evaluationsRepository = getRepository(QAEvaluations);
        try {

            let evalData = await indiUserRepository.createQueryBuilder("qa_indicator_user")
                .select('qa_indicator_user.`userId`, `evaluations`.`indicatorUserId`, crps.name, crps.acronym')
                .leftJoinAndSelect(QAEvaluations, "evaluations", "evaluations.indicatorUserId  = qa_indicator_user.id")
                .leftJoinAndSelect(QAIndicators, "indicators", "indicators.view_name = evaluations.indicator_view_name")
                .leftJoinAndSelect(QACrp, "crps", "evaluations.crp_id = crps.crp_id")
                .groupBy('`evaluations`.crp_id,evaluations.`indicator_view_name`')
                .orderBy('evaluations.`crp_id`', "ASC")
                .getRawMany();

            evalData = EvaluationsController.groupBy(evalData, 'indicators_name')

            res.status(200).json({ data: evalData, message: "Indicators by crp" });

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Could not get indicators by crp." });
        }
    }








    /***
     * 
     *  PRIVATE FUNCTIONS
     * 
     ***/

    static getType(status) {
        let res = ""
        switch (status) {
            case StatusHandler.Pending:
                res = 'danger'
                break;
            case StatusHandler.Complete:
                res = 'success'
                break;

            default:
                break;
        }

        return res;
    }

    static groupBy(array, key) {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(
                currentValue
            );
            return result;
        }, {});
    };

    static parseEvaluationsData(rawData, type?) {
        let response = [];
        console.log('parseEvaluationsData', type)
        switch (type) {
            case 'innovations':
                for (let index = 0; index < rawData.length; index++) {
                    const element = rawData[index];
                    let field = element["meta_display_name"].split(' ').join("_");

                    if (!element["meta_is_primay"] && element['meta_include_detail']) {
                        response.push({
                            enable_comments: (element["meta_enable_comments"] === 1) ? true : false,
                            display_name: element["meta_display_name"],
                            display_type: DisplayTypeHandler.Paragraph,
                            value: element[`${type}_${field}`],
                            field_id: element["meta_id"],
                            evaluation_id: element["evaluations_id"],
                            general_comment: element["evaluations_general_comments"],
                            status: element["evaluations_status"],
                        })

                    }
                }
                break;

            default:
                for (let index = 0; index < rawData.length; index++) {
                    const element = rawData[index];
                    response.push({
                        indicator_view_name: element['evaluations_indicator_view_name'],
                        status: element['evaluations_status'],
                        type: EvaluationsController.getType(element['evaluations_status']),
                        value: element['count'],
                        id: element['evaluations_indicator_view_id'],
                        title: element['title'],
                        pdf: element['pdf'] ? element['pdf'] : 'pdf_URL',
                        crp: element['crp'],
                    })

                }

                break;
        }


        return response;
    }
}

export default EvaluationsController;