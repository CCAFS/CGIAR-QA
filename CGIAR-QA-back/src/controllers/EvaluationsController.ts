import { Request, Response } from "express";
import { getRepository, In } from "typeorm";

import { QAIndicatorUser } from "@entity/IndicatorByUser";
import { QACrp } from "@entity/CRP";
import { QAEvaluations } from "@entity/Evaluations";

import { StatusHandler } from "@helpers/StatusHandler"
import { QAIndicators } from "@entity/Indicators";

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
                    .addSelect("COUNT(evaluations.`status`)", "count")
                    .groupBy("evaluations.`status`")
                    .orderBy("evaluations.`status`", 'ASC')
                    .addGroupBy("evaluations.`indicator_view_name`")
                    // .getSql()
                    .getRawMany()

            } else {

                rawData = await indicatorByUserRepository
                    .createQueryBuilder("qa_indicator_user")
                    .leftJoinAndSelect("qa_indicator_user.evaluations", "evaluations")
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

}

export default EvaluationsController;