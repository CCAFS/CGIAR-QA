import { Request, Response } from "express";
import { getRepository, In } from "typeorm";
import { validate } from "class-validator";

import { QAIndicatorUser } from "../entity/IndicatorByUser";
import { QAEvaluations } from "../entity/Evaluations";


class EvaluationsController {

    /**
     * 
     * Evaluations CRUD
     * 
     */

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
                .getRawMany();

            let response = []
            for (let index = 0; index < rawData.length; index++) {
                const element = rawData[index];
                response.push({
                    indicator_view_name: element['evaluations_indicator_view_name'],
                    status: element['evaluations_status'],
                    count: element['count'],
                })
                
            }

            res.status(200).json({ data: response, message: "User evaluations" });
        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Could not access to evaluations." });
        }
    }

}

export default EvaluationsController;