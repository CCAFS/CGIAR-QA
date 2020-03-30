import { Request, Response } from "express";
import { validate, validateOrReject } from "class-validator";
import { getRepository, In, getConnection, QueryRunner } from "typeorm";

import { QAUsers } from "@entity/User";
import { QARoles } from "@entity/Roles";
import { QACrp } from "@entity/CRP";
import { QAComments } from "@entity/Comments";
import { QACommentsMeta } from "@entity/CommentsMeta";

import Util from "@helpers/Util"

class CommentController {


    static commentsCount = async (req: Request, res: Response) => {
        const { crp_id, id } = req.query;
        let queryRunner = getConnection().createQueryBuilder();
        try {

            if (crp_id) {
                const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                    `SELECT
                        evaluations.indicator_view_name,
                        (
                            SELECT
                                COUNT(DISTINCT id)
                            FROM
                                qa_comments
                            WHERE
                                qa_comments.evaluationId = evaluations.id
                        ) AS count
                    FROM
                        qa_evaluations evaluations
                    WHERE
                        evaluations.crp_id = :crp_id
                        `,
                    { crp_id },
                    {}
                );
                let rawData = await queryRunner.connection.query(query, parameters);
                res.status(200).json({ data: Util.parseCommentData(rawData, 'indicator_view_name'), message: 'Comments by crp' });
            }
        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Could not access to evaluations." });
        }

        // console.log( crp_id, id)
        // res.status(200).send()
    }
}

export default CommentController;