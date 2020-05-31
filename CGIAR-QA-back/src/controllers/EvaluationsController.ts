import { Request, Response } from "express";
import { getRepository, getConnection } from "typeorm";

import { QACrp } from "@entity/CRP";
import { QAEvaluations } from "@entity/Evaluations";
import { QAUsers } from "@entity/User";

import { RolesHandler } from "@helpers/RolesHandler";
import Util from "@helpers/Util";


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
        let queryRunner = getConnection().createQueryBuilder();

        //Get evaluations from database
        try {
            //const indicatorByUserRepository = getRepository(QAIndicatorUser);

            const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                `SELECT
                evaluations.status AS status,
                meta.enable_crp,
                meta.enable_assessor,
                evaluations.indicator_view_name AS indicator_view_name,
                indicator.primary_field AS primary_field,
                indicator.order AS indicator_order,
                COUNT(DISTINCT evaluations.id) AS count
            FROM
                qa_indicator_user qa_indicator_user
            LEFT JOIN qa_indicators indicator ON indicator.id = qa_indicator_user.indicatorId
            LEFT JOIN qa_evaluations evaluations ON evaluations.indicator_view_name = indicator.view_name
            LEFT JOIN qa_crp crp ON crp.crp_id = evaluations.crp_id
            LEFT JOIN qa_comments_meta meta ON meta.indicatorId = indicator.id
            WHERE
                crp.active = 1
            AND crp.qa_active = 'open'
            AND
                qa_indicator_user.userId = :user_Id
            GROUP BY
                evaluations.status,
                evaluations.indicator_view_name,
                meta.enable_crp,
                meta.enable_assessor,
                indicator.order,
                indicator.primary_field
            ORDER BY
                indicator_order ASC,
                evaluations.status
                `,
                { user_Id: id },
                {}
            );
            // console.log(query, parameters)
            let rawData = await queryRunner.connection.query(query, parameters);

            let response = []
            for (let index = 0; index < rawData.length; index++) {
                const element = rawData[index];
                response.push({
                    indicator_view_name: element['indicator_view_name'],
                    status: element['status'],
                    indicator_status: element['enable_assessor'],
                    type: Util.getType(element['status']),
                    value: element['count'],
                    label: `${element['count']}`,
                    primary_field: element["primary_field"],
                    order: element['indicator_order']
                    // total: element['sum'],
                })

            }


            let result = Util.groupBy(response, 'indicator_view_name');
            // console.log('result')
            // console.log(result)
            res.status(200).json({ data: result, message: "User evaluations" });
        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "User evaluations Could not access to evaluations." });
        }
    }

    // get evaluations LIST by user
    static getListEvaluationsDash = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
        const { crp_id } = req.query;
        // const view_name = `qa_${req.body.view_name}`;
        const view_name = req.body.view_name;
        const view_primary_field = req.body.view_primary_field;
        const levelQuery = EvaluationsController.getLevelQuery(view_name)


        /***
         * 
         *  evaluations.evaluation_status <> 'Deleted'
                OR evaluations.evaluation_status IS NULL
                AND 
         * 
         */

        let queryRunner = getConnection().createQueryBuilder();
        try {
            const userRepository = getRepository(QAUsers);
            let user = await userRepository.findOneOrFail({ where: { id } });
            let isAdmin = user.roles.find(x => x.description == RolesHandler.admin);
            if (isAdmin) {
                let sql = `
                SELECT
                    evaluations.id AS evaluation_id,
                    evaluations.status AS evaluations_status,
                    evaluations.indicator_view_name,
                    evaluations.indicator_view_id,
                    evaluations.crp_id,
                    crp.acronym AS crp_acronym,
                    crp.name AS crp_name,
                    (
                        SELECT
                            COUNT(id)
                        FROM
                            qa_comments
                        WHERE
                            qa_comments.evaluationId = evaluations.id
                        AND approved_no_comment IS NULL
                        AND metaId IS NOT NULL
                        AND is_deleted = 0
                        AND is_visible = 1
                    ) AS comments_count,
                    ( SELECT COUNT(id) FROM qa_comments_replies WHERE commentId IN (SELECT id FROM qa_comments WHERE qa_comments.evaluationId = evaluations.id 	AND approved_no_comment IS NULL	AND metaId IS NOT NULL AND is_deleted = 0 AND is_visible = 1) ) AS comments_replies_count,
                    ${levelQuery.view_sql}
                    (
                        SELECT title FROM ${view_name} ${view_name} WHERE ${view_name}.id = evaluations.indicator_view_id
                    ) AS title,
                    (
                        SELECT
                            group_concat(DISTINCT users.username)
                        FROM
                            qa_comments comments
                        LEFT JOIN qa_users users ON users.id = comments.userId
                        WHERE
                            comments.evaluationId = evaluations.id
                        AND comments.is_deleted = 0
                    ) comment_by
                FROM
                    qa_evaluations evaluations
                LEFT JOIN qa_indicators indicators ON indicators.view_name = evaluations.indicator_view_name
                LEFT JOIN qa_crp crp ON crp.crp_id = evaluations.crp_id
                
                WHERE evaluations.indicator_view_name = :view_name
                AND crp.active = 1
                AND crp.qa_active = 'open'
                
                GROUP BY
                    crp.crp_id,
                    ${levelQuery.innovations_stage}
                    evaluations.id
            `;
                const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                    sql,
                    { view_name },
                    {}
                );
                // console.log(sql)
                let rawData = await queryRunner.connection.query(query, parameters);
                res.status(200).json({ data: Util.parseEvaluationsData(rawData), message: "User evaluations list" });
                return;
            } else if ( user.crps.length > 0 ) {
                let sql = `
                    SELECT
                        evaluations.id AS evaluation_id,
                        evaluations.status AS evaluations_status,
                        evaluations.indicator_view_name,
                        evaluations.indicator_view_id,
                        evaluations.crp_id,
                        crp.acronym AS crp_acronym,
                        crp.name AS crp_name,
                        (
                            SELECT
                                COUNT(id)
                            FROM
                                qa_comments
                            WHERE
                                qa_comments.evaluationId = evaluations.id
                            AND approved_no_comment IS NULL
                            AND metaId IS NOT NULL
                            AND is_deleted = 0
                            AND is_visible = 1
                        ) AS comments_count,
                        ( SELECT COUNT(id) FROM qa_comments_replies WHERE commentId IN (SELECT id FROM qa_comments WHERE qa_comments.evaluationId = evaluations.id 	AND approved_no_comment IS NULL	AND metaId IS NOT NULL AND is_deleted = 0 AND is_visible = 1) ) AS comments_replies_count,
                        (
                            SELECT title FROM ${view_name} ${view_name} WHERE ${view_name}.id = evaluations.indicator_view_id
                        ) AS title,
                        ${levelQuery.view_sql}
                        indicator_user.indicatorId
                    FROM
                        qa_evaluations evaluations
                    LEFT JOIN qa_indicators indicators ON indicators.view_name = evaluations.indicator_view_name
                    LEFT JOIN qa_crp crp ON crp.crp_id = evaluations.crp_id
                    LEFT JOIN qa_indicator_user indicator_user ON indicator_user.indicatorId = indicators.id
                    WHERE evaluations.indicator_view_name = :view_name
                    AND crp.active = 1
                    AND crp.qa_active = 'open'
                    AND evaluations.crp_id = :crp_id
                    GROUP BY
                        crp.crp_id,
                        evaluations.id,
                        ${levelQuery.innovations_stage}
                        indicator_user.indicatorId
                `;
                const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                    sql,
                    { crp_id: crp_id, view_name },
                    {}
                );
                let rawData = await queryRunner.connection.query(query, parameters);
                res.status(200).json({ data: Util.parseEvaluationsData(rawData), message: "CRP evaluations list" });

            }
            else {
                let sql = `
                    SELECT
                        evaluations.id AS evaluation_id,
                        evaluations.status AS evaluations_status,
                        evaluations.indicator_view_name,
                        evaluations.indicator_view_id,
                        evaluations.crp_id,
                        crp.acronym AS crp_acronym,
                        crp.name AS crp_name,
                        (
                            SELECT
                                COUNT(id)
                            FROM
                                qa_comments
                            WHERE
                                qa_comments.evaluationId = evaluations.id
                            AND approved_no_comment IS NULL
                            AND metaId IS NOT NULL
                            AND is_deleted = 0
                            AND is_visible = 1
                        ) AS comments_count,
                        ( SELECT COUNT(id) FROM qa_comments_replies WHERE commentId IN (SELECT id FROM qa_comments WHERE qa_comments.evaluationId = evaluations.id 	AND approved_no_comment IS NULL	AND metaId IS NOT NULL AND is_deleted = 0 AND is_visible = 1) ) AS comments_replies_count,
                        (
                            SELECT title FROM ${view_name} ${view_name} WHERE ${view_name}.id = evaluations.indicator_view_id
                        ) AS title,
                        ${levelQuery.view_sql}
                        indicator_user.indicatorId,
                        (
                            SELECT
                                group_concat(DISTINCT users.username)
                            FROM
                                qa_comments comments
                            LEFT JOIN qa_users users ON users.id = comments.userId
                            WHERE
                                comments.evaluationId = evaluations.id
                            AND comments.is_deleted = 0
                        ) comment_by
                    FROM
                        qa_evaluations evaluations
                    LEFT JOIN qa_indicators indicators ON indicators.view_name = evaluations.indicator_view_name
                    LEFT JOIN qa_crp crp ON crp.crp_id = evaluations.crp_id
                    LEFT JOIN qa_indicator_user indicator_user ON indicator_user.indicatorId = indicators.id
                    
                    WHERE evaluations.indicator_view_name = :view_name
                    AND indicator_user.userId = :user_Id
                    AND crp.active = 1
                    AND crp.qa_active = 'open'
                    
                    GROUP BY
                        crp.crp_id,
                        evaluations.id,
                        ${levelQuery.innovations_stage}
                        indicator_user.indicatorId
                `;
                const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                    sql,
                    { user_Id: id, view_name },
                    {}
                );
                let rawData = await queryRunner.connection.query(query, parameters);
                res.status(200).json({ data: Util.parseEvaluationsData(rawData), message: "User evaluations list" });

            }


        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "User evaluations list could not access to evaluations." });
        }
    }

    private static getLevelQuery(view_name: string) {
        let response = {
            view_sql: '',
            innovations_stage: '',
        }
        switch (view_name) {
            case 'qa_innovations':
                response.view_sql = "(SELECT stage FROM qa_innovations innovations WHERE innovations.id = evaluations.indicator_view_id) AS stage,"
                // response.innovations_stage = "qa_innovations.stage,"
                break;
            case 'qa_policies':
                response.view_sql = "(SELECT maturity_level FROM qa_policies policies WHERE policies.id = evaluations.indicator_view_id) AS stage,"
                // response.innovations_stage = "qa_policies.maturity_level,"
                break;
            case 'qa_oicr':
                response.view_sql = "(SELECT maturity_level FROM qa_oicr oicr WHERE oicr.id = evaluations.indicator_view_id) AS stage,"
                // response.innovations_stage = "qa_oicr.maturity_level,"
                break;
            case 'qa_melia':
                response.view_sql = "(SELECT study_type FROM qa_melia melia WHERE melia.id = evaluations.indicator_view_id) AS stage,"
                // response.innovations_stage = "qa_melia.study_type,"
                break;
            case 'qa_publications':
                response.view_sql = "(SELECT is_ISI FROM qa_publications publications WHERE publications.id = evaluations.indicator_view_id) AS stage,"
                // response.innovations_stage = "qa_melia.study_type,"
                break;
            case 'qa_milestones':
                response.view_sql = "(SELECT status FROM qa_milestones milestones WHERE milestones.id = evaluations.indicator_view_id) AS stage,"
                // response.innovations_stage = "qa_melia.study_type,"
                break;

            default:
                break;
        }
        return response;
    }


    // get detailed evaluation by user
    static getDetailedEvaluationDash = async (req: Request, res: Response) => {

        //Get the ID from the url
        const id = req.params.id;
        const view_name = `qa_${req.body.type}`;
        const view_name_psdo = `${req.body.type}`;
        const indicatorId = req.body.indicatorId;
        let queryRunner = getConnection().createQueryBuilder();

        // console.log(view_name, view_primary_field)
        //Get indicator item data from view
        try {
            const userRepository = getRepository(QAUsers);
            let user = await userRepository.findOneOrFail({ where: { id } });
            let isAdmin = user.roles.find(x => x.description == RolesHandler.admin);
            let rawData;
            if (isAdmin) {

                const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                    `
                        SELECT
                            ${view_name_psdo}.*, 
                            meta.enable_comments AS meta_enable_comments,
                            meta.col_name AS meta_col_name,
                            meta.display_name AS meta_display_name,
                            meta.id AS meta_id,
                            meta.order AS order_,
                            meta.description AS meta_description,
                            meta.include_detail AS meta_include_detail,
                            meta.is_primay AS meta_is_primay,
                            evaluations.id AS evaluation_id,
                            crp.name AS crp_name,
                            crp.acronym AS crp_acronym,
                            evaluations.status AS evaluations_status,
                        ( SELECT enable_assessor FROM qa_comments_meta WHERE indicatorId = indicators.id ) AS enable_assessor,
                        ( SELECT id FROM qa_comments WHERE metaId IS NULL  AND evaluationId = evaluations.id  AND is_deleted = 0 AND approved_no_comment IS NULL LIMIT 1 ) AS general_comment_id,
                        ( SELECT detail FROM qa_comments WHERE metaId IS NULL  AND evaluationId = evaluations.id  AND is_deleted = 0 AND approved_no_comment IS NULL LIMIT 1 ) AS general_comment,
                        ( SELECT user_.username FROM qa_comments comments LEFT JOIN qa_users user_ ON user_.id = comments.userId WHERE metaId IS NULL  AND evaluationId = evaluations.id  AND is_deleted = 0 AND approved_no_comment IS NULL LIMIT 1 ) AS general_comment_user,
                        ( SELECT user_.updatedAt FROM qa_comments comments LEFT JOIN qa_users user_ ON user_.id = comments.userId WHERE metaId IS NULL  AND evaluationId = evaluations.id  AND is_deleted = 0 AND approved_no_comment IS NULL LIMIT 1 ) AS general_comment_updatedAt,
                        ( SELECT approved_no_comment FROM qa_comments WHERE metaId = meta.id AND evaluationId = evaluations.id 	AND is_deleted = 0 AND approved_no_comment IS NOT NULL LIMIT 1) AS approved_no_comment,
                        ( SELECT COUNT(id) FROM qa_comments_replies WHERE commentId IN (SELECT id FROM qa_comments WHERE qa_comments.evaluationId = evaluations.id 	AND approved_no_comment IS NULL	AND metaId IS NOT NULL AND is_deleted = 0 AND is_visible = 1) ) AS comments_replies_count,
                        ( SELECT COUNT(DISTINCT id) FROM qa_comments WHERE metaId = meta.id  AND evaluationId = evaluations.id  AND is_visible = 1 AND is_deleted = 0 AND evaluationId = evaluations.id AND approved_no_comment IS NULL ) AS replies_count
                        FROM
                            ${view_name} ${view_name_psdo}
                        LEFT JOIN qa_evaluations evaluations ON evaluations.indicator_view_id = ${view_name_psdo}.id
                        LEFT JOIN qa_indicators indicators ON indicators.view_name = '${view_name}'
                        LEFT JOIN qa_indicators_meta meta ON meta.indicatorId = indicators.id
                        LEFT JOIN qa_crp crp ON crp.crp_id = evaluations.crp_id
                        WHERE ${view_name_psdo}.id = :indicatorId 
                        AND evaluations.indicator_view_name = '${view_name}'
                        ORDER BY meta.order ASC
                        `,
                    { user_Id: id, indicatorId },
                    {}
                );
                // console.log('admin')
                // console.log(query, parameters)
                rawData = await queryRunner.connection.query(query, parameters);

            }
            else if (user.crps.length > 0) {
                const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                    `
                        SELECT
                            ${view_name_psdo}.*, 
                            meta.enable_comments AS meta_enable_comments,
                            meta.col_name AS meta_col_name,
                            meta.display_name AS meta_display_name,
                            meta.id AS meta_id,
                            meta.order AS order_,
                            meta.description AS meta_description,
                            meta.include_detail AS meta_include_detail,
                            meta.is_primay AS meta_is_primay,
                            evaluations.id AS evaluation_id,
                            crp.name AS crp_name,
                            crp.acronym AS crp_acronym,
                            evaluations.status AS evaluations_status,
                        ( SELECT enable_crp FROM qa_comments_meta WHERE indicatorId = indicators.id ) AS enable_crp,
                        ( SELECT id FROM qa_comments WHERE metaId IS NULL  AND evaluationId = evaluations.id  AND is_deleted = 0 AND approved_no_comment IS NULL LIMIT 1 ) AS general_comment_id,
                        ( SELECT detail FROM qa_comments WHERE metaId IS NULL  AND evaluationId = evaluations.id  AND is_deleted = 0 AND approved_no_comment IS NULL LIMIT 1 ) AS general_comment,
                        ( SELECT user_.username FROM qa_comments comments LEFT JOIN qa_users user_ ON user_.id = comments.userId WHERE metaId IS NULL  AND evaluationId = evaluations.id  AND is_deleted = 0 AND approved_no_comment IS NULL LIMIT 1 ) AS general_comment_user,
                        ( SELECT user_.updatedAt FROM qa_comments comments LEFT JOIN qa_users user_ ON user_.id = comments.userId WHERE metaId IS NULL  AND evaluationId = evaluations.id  AND is_deleted = 0 AND approved_no_comment IS NULL LIMIT 1 ) AS general_comment_updatedAt,
                        ( SELECT approved_no_comment FROM qa_comments WHERE metaId = meta.id AND evaluationId = evaluations.id 	AND is_deleted = 0 AND approved_no_comment IS NOT NULL LIMIT 1) AS approved_no_comment,
                        ( SELECT COUNT(id) FROM qa_comments_replies WHERE commentId IN (SELECT id FROM qa_comments WHERE qa_comments.evaluationId = evaluations.id 	AND approved_no_comment IS NULL	AND metaId IS NOT NULL AND is_deleted = 0 AND is_visible = 1) ) AS comments_replies_count,


                        ( SELECT COUNT(DISTINCT id) FROM qa_comments WHERE metaId = meta.id  AND evaluationId = evaluations.id  AND is_visible = 1 AND is_deleted = 0 AND approved_no_comment IS NULL AND crp_approved = 1 ) AS crp_accepted,
                        ( SELECT COUNT(DISTINCT id) FROM qa_comments WHERE metaId = meta.id  AND evaluationId = evaluations.id  AND is_visible = 1 AND is_deleted = 0 AND approved_no_comment IS NULL AND crp_approved = 0 ) AS crp_rejected,


                        ( SELECT COUNT(DISTINCT id) FROM qa_comments WHERE metaId = meta.id  AND evaluationId = evaluations.id  AND is_visible = 1 AND is_deleted = 0 AND approved_no_comment IS NULL ) AS replies_count
                        FROM
                            ${view_name} ${view_name_psdo}
                        LEFT JOIN qa_evaluations evaluations ON evaluations.indicator_view_id = ${view_name_psdo}.id
                        LEFT JOIN qa_indicators indicators ON indicators.view_name = '${view_name}'
                        LEFT JOIN qa_indicators_meta meta ON meta.indicatorId = indicators.id
                        LEFT JOIN qa_crp crp ON crp.crp_id = evaluations.crp_id
                        WHERE ${view_name_psdo}.id = :indicatorId 
                        AND evaluations.indicator_view_name = '${view_name}'
                        ORDER BY meta.order ASC
                        `,
                    { indicatorId },
                    {}
                );
                // console.log('crp')
                // console.log(query, parameters)
                rawData = await queryRunner.connection.query(query, parameters);
            }
            else {
                const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                    `
                    SELECT
                        ${view_name_psdo}.*, 
                        meta.enable_comments AS meta_enable_comments,
                        meta.col_name AS meta_col_name,
                        meta.display_name AS meta_display_name,
                        meta.id AS meta_id,
                        meta.order AS order_,
                        meta.description AS meta_description,
                        meta.include_detail AS meta_include_detail,
                        meta.is_primay AS meta_is_primay,
                        evaluations.id AS evaluation_id,
                        crp.name AS crp_name,
                        crp.acronym AS crp_acronym,
                        evaluations.status AS evaluations_status,
                    ( SELECT enable_assessor FROM qa_comments_meta WHERE indicatorId = indicator_user.indicatorId ) AS enable_assessor,
                    ( SELECT id FROM qa_comments WHERE metaId IS NULL  AND evaluationId = evaluations.id  AND is_deleted = 0 AND approved_no_comment IS NULL LIMIT 1 ) AS general_comment_id,
                    ( SELECT detail FROM qa_comments WHERE metaId IS NULL  AND evaluationId = evaluations.id  AND is_deleted = 0 AND approved_no_comment IS NULL LIMIT 1 ) AS general_comment,
                    ( SELECT user_.username FROM qa_comments comments LEFT JOIN qa_users user_ ON user_.id = comments.userId WHERE metaId IS NULL  AND evaluationId = evaluations.id  AND is_deleted = 0 AND approved_no_comment IS NULL LIMIT 1 ) AS general_comment_user,
                    ( SELECT user_.updatedAt FROM qa_comments comments LEFT JOIN qa_users user_ ON user_.id = comments.userId WHERE metaId IS NULL  AND evaluationId = evaluations.id  AND is_deleted = 0 AND approved_no_comment IS NULL LIMIT 1 ) AS general_comment_updatedAt,
                    ( SELECT approved_no_comment FROM qa_comments WHERE metaId = meta.id AND evaluationId = evaluations.id 	AND is_deleted = 0 AND approved_no_comment IS NOT NULL LIMIT 1) AS approved_no_comment,
                    ( SELECT COUNT(id) FROM qa_comments_replies WHERE commentId IN (SELECT id FROM qa_comments WHERE qa_comments.evaluationId = evaluations.id 	AND approved_no_comment IS NULL	AND metaId IS NOT NULL AND is_deleted = 0 AND is_visible = 1) ) AS comments_replies_count,
                    ( SELECT COUNT(DISTINCT id) FROM qa_comments WHERE metaId = meta.id  AND evaluationId = evaluations.id  AND is_visible = 1 AND is_deleted = 0 AND evaluationId = evaluations.id AND approved_no_comment IS NULL ) AS replies_count
                    FROM
                        ${view_name} ${view_name_psdo}
                    LEFT JOIN qa_evaluations evaluations ON evaluations.indicator_view_id = ${view_name_psdo}.id
                    LEFT JOIN qa_indicators indicators ON indicators.view_name = '${view_name}'
                    LEFT JOIN qa_indicator_user indicator_user ON indicator_user.indicatorId = indicators.id
                    LEFT JOIN qa_indicators_meta meta ON meta.indicatorId = indicators.id
                    LEFT JOIN qa_crp crp ON crp.crp_id = evaluations.crp_id
                    WHERE indicator_user.userId = :user_Id
                    AND ${view_name_psdo}.id = :indicatorId
                    AND evaluations.indicator_view_name = '${view_name}'
                    ORDER BY meta.order ASC
                    `,
                    { user_Id: id, indicatorId },
                    {}
                );
                console.log('assessor')
                console.log(query, parameters)
                rawData = await queryRunner.connection.query(query, parameters);

            }

            res.status(200).json({ data: Util.parseEvaluationsData(rawData, view_name_psdo), message: "User evaluation detail" });
        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "User evaluation detail could not access to evaluations." });
        }
    }

    static updateDetailedEvaluation = async (req: Request, res: Response) => {
        const id = req.params.id;
        const { general_comments, status } = req.body;
        const evaluationsRepository = getRepository(QAEvaluations);

        // console.log({ general_comments, status }, id)
        try {
            let evaluation = await evaluationsRepository.findOneOrFail(id);
            // evaluation.general_comments = general_comments;
            evaluation.status = status;

            let updatedEva = await evaluationsRepository.save(evaluation);
            res.status(200).json({ data: updatedEva, message: "Evaluation updated." });

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Could not update evaluation.", data: error });
        }
    }


    // get all evaluations dashboard
    static getAllEvaluationsDash = async (req: Request, res: Response) => {

        let { crp_id } = req.query;
        let queryRunner = getConnection().createQueryBuilder();


        try {
            let rawData;
            if (crp_id !== undefined && crp_id !== "undefined") {
                const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                    `SELECT
                    evaluations.status AS status,
                    evaluations.crp_id AS crp_id,
                    evaluations.indicator_view_name AS indicator_view_name,
                    indicator.primary_field AS primary_field,
                    (SELECT enable_crp FROM qa_comments_meta comments_meta WHERE comments_meta.indicatorId = indicator.id) AS indicator_status,
                    indicator.order AS indicator_order, COUNT(DISTINCT evaluations.id) AS count
                FROM
                    qa_indicator_user qa_indicator_user
                LEFT JOIN qa_indicators indicator ON indicator.id = qa_indicator_user.indicatorId
                LEFT JOIN qa_evaluations evaluations ON evaluations.indicator_view_name = indicator.view_name
                LEFT JOIN qa_crp crp ON crp.crp_id = evaluations.crp_id
                WHERE
                    crp.active = 1
                AND crp.qa_active = 'open'
                AND
                    evaluations.crp_id = :crp_id
                GROUP BY
                    evaluations.status,
                    evaluations.indicator_view_name,
                    evaluations.crp_id,
                    indicator_order,
                    indicator.id,
                    indicator.primary_field
                ORDER BY
                    indicator.order ASC,
                    evaluations.status `,
                    { crp_id: crp_id },
                    {}
                );
                // console.log(query, parameters);
                rawData = await queryRunner.connection.query(query, parameters);
            } else {
                const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                    `SELECT
                        evaluations.status AS status,
                        evaluations.indicator_view_name AS indicator_view_name,
                        indicator.primary_field AS primary_field,
                        indicator.order AS indicator_order,
                        COUNT(DISTINCT evaluations.id) AS count
                    FROM
                        qa_indicator_user qa_indicator_user
                    
                    LEFT JOIN qa_indicators indicator ON indicator.id = qa_indicator_user.indicatorId
                    LEFT JOIN qa_evaluations evaluations ON evaluations.indicator_view_name = indicator.view_name
                    LEFT JOIN qa_crp crp ON crp.crp_id = evaluations.crp_id
                    WHERE
                        crp.active = 1
                    AND crp.qa_active = 'open'
                    GROUP BY
                        evaluations.status,
                        evaluations.indicator_view_name,
                        indicator_order,
                        indicator.primary_field
                    ORDER BY
                        indicator.order ASC,
                        evaluations.status `,
                    {},
                    {}
                );
                rawData = await queryRunner.connection.query(query, parameters);
            }

            let response = []

            for (let index = 0; index < rawData.length; index++) {
                const element = rawData[index];
                response.push({
                    indicator_view_name: element['indicator_view_name'],
                    status: element['status'],
                    type: Util.getType(element['status'], (crp_id !== undefined && crp_id !== "undefined")),
                    value: element['count'],
                    indicator_status: element['indicator_status'],
                    crp_id: (crp_id) ? element['crp_id'] : null,
                    label: `${element['count']}`,
                    primary_field: element["primary_field"],
                    order: element['indicator_order']
                })

            }
            // console.log(response)
            let result = Util.groupBy(response, 'indicator_view_name');
            // res.status(200).json({ data: rawData, message: "All evaluations" });
            res.status(200).json({ data: result, message: "All evaluations" });
        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "All evaluations could not access to evaluations." });
        }

    }

    // get all CRPS
    static getCRPS = async (req: Request, res: Response) => {

        const crpRepository = await getRepository(QACrp);

        try {
            let allCRP = await crpRepository.find({ where: { active: true } });
            res.status(200).json({ data: allCRP, message: "All CRPs" });
        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Could not get crp." });
        }

    }

    //get active indicators (admin dashboard)
    static getIndicatorsByCrp = async (req: Request, res: Response) => {
        //const indiUserRepository = getRepository(QAIndicatorUser);
        let queryRunner = getConnection().createQueryBuilder();
        try {

            const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                `SELECT
                        indicators.id,
                        meta.enable_assessor,
                        meta.enable_crp,
                        indicators.name AS indicator_view_name,
                        indicators.order AS indicator_order
                    FROM
                        qa_indicators indicators
                    LEFT JOIN qa_comments_meta meta ON indicators.id = meta.indicatorId
                    GROUP BY
                        indicators.id,
                        indicator_order,
                        meta.enable_assessor,
                        meta.enable_crp,
                        indicators.name
                    ORDER BY
                        indicators.order ASC
                       `,
                {},
                {}
            );
            let evalData = await queryRunner.connection.query(query, parameters);
            res.status(200).json({ data: evalData, message: "Indicators settings" });

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Could not get indicators settings." });
        }
    }

    //get evaluation criteria by indicator 
    static getCriteriaByIndicator = async (req: Request, res: Response) => {
        const { indicatorName } = req.params;
        let queryRunner = getConnection().createQueryBuilder();
        try {
            const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                `SELECT
                    qa_criteria
                FROM
                    qa_indicators indicators
                WHERE view_name = :indicatorName
                       `,
                { indicatorName },
                {}
            );
            let evalData = await queryRunner.connection.query(query, parameters);
            res.status(200).json({ data: evalData, message: "Indicator evaluation criteria" });

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Could not get any evaluation criteria." });
        }
    }

}


export default EvaluationsController;