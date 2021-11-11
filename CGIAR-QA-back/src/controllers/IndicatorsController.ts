import { Request, Response, response } from "express";
import { getRepository, createQueryBuilder, getConnection, Not } from "typeorm";
import { validate } from "class-validator";

import { QAUsers } from "@entity/User";
import { QAIndicators } from "@entity/Indicators";
import { QAIndicatorUser } from "@entity/IndicatorByUser";
import { QAEvaluations } from "@entity/Evaluations";
import { QAIndicatorsMeta } from "@entity/IndicatorsMeta";
import { QACommentsMeta } from "@entity/CommentsMeta";

import { StatusHandlerMIS } from "@helpers/StatusHandler"
import { RolesHandler } from "@helpers/RolesHandler"
import Util from "@helpers/Util";
import { GeneralIndicatorName } from "@helpers/GeneralIndicatorName";
import { QABatch } from "@entity/Batch";
import { QAComments } from "@entity/Comments";


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
        const { id } = req.params;
        const { crp_id } = req.query;
        let queryRunner = getConnection().createQueryBuilder();
        let response = []


        //Get user by id; if manager all indicators; 
        try {
            const userRepository = getRepository(QAUsers);
            let user = await userRepository.findOneOrFail({ where: { id } });
            let isAdmin = user.roles.find(x => x.description == RolesHandler.admin);

            let isCRP = user.crps.length > 0 ? true : false;
            console.log({user});
            
            // console.log('getIndicatorsByUser')
            // console.log('isAdmin', isAdmin)
            if (isAdmin) {
                const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                    `
                    SELECT
                        DISTINCT (name), description, primary_field, view_name, qa_indicators.order AS indicator_order
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
                    SELECT
                            DISTINCT (evaluations.indicator_view_name),
                            indicators.name AS name,
                            indicators.description AS description,
                            indicators.primary_field AS primary_field,
                            indicators.order AS indicator_order,
                            indicators.view_name AS view_name,
                            comment_meta.enable_crp AS enable_crp
                    FROM
                            qa_indicators indicators
                    LEFT JOIN qa_comments_meta comment_meta ON comment_meta.indicatorId = indicators.id
                    LEFT JOIN qa_evaluations evaluations ON evaluations.indicator_view_name = indicators.view_name
                    WHERE evaluations.crp_id = :crp_id
                    ORDER BY 
                            indicator_order ASC
                    `,
                    { crp_id: crp_id },
                    {}
                );
                // indicators.view_name IN (SELECT indicator_view_name FROM qa_evaluations WHERE crp_id = :crp_id)
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
                        indicators.view_name AS view_name,
                        meta.enable_assessor as enable_assessor,
                        qa_indicator_user.isLeader as is_leader
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

    // get status of items of each indicator
    static getItemStatusByIndicator = async (req: Request, res: Response) => {

        const indicator = req.params.indicator;
        const crp_id = req.query.crp_id;
        let totalEvaluationsByIndicator = {
            qa_innovations: {},
            qa_policies: {},
            qa_publications: {},
            qa_oicr: {},
            qa_melia: {},
            qa_capdev: {},
            qa_milestones: {},
            qa_outcomes: {},
            qa_slo: {}
        };
        const indicators = Object.keys(GeneralIndicatorName);



        let qrMetas = getConnection().createQueryBuilder();
        try {
            let queryMetas = '';
            if (crp_id != undefined && crp_id != 'undefined') {
                queryMetas = `SELECT col_name, display_name, indicatorId, qi.view_name,
                    (SELECT count(*) FROM qa_evaluations qe WHERE qe.indicator_view_name = qi.view_name AND qe.phase_year = actual_phase_year() AND qe.status <> 'autochecked' AND qe.crp_id = '${crp_id}') AS total
                   FROM qa_indicators_meta qim
                   LEFT JOIN qa_indicators qi ON qi.id = qim.indicatorId
                   WHERE qim.display_name  not like 'id'
                   AND qim.enable_comments <> 0
                   AND qim.include_detail = 1
                   AND qi.view_name like :indicator`;
                console.log('query with crp_id', { queryMetas });
            } else {
                queryMetas = `SELECT col_name, display_name, indicatorId, qi.view_name,
                    (SELECT count(*) FROM qa_evaluations qe WHERE qe.indicator_view_name = qi.view_name AND qe.phase_year = actual_phase_year() AND qe.status <> 'autochecked') AS total
                   FROM qa_indicators_meta qim
                   LEFT JOIN qa_indicators qi ON qi.id = qim.indicatorId
                   WHERE qim.display_name  not like 'id'
                   AND qim.enable_comments <> 0
                   AND qim.include_detail = 1
                   AND qi.view_name like :indicator`;
            }

            const [query, parameters] = await qrMetas.connection.driver.escapeQueryWithParameters(
                queryMetas,
                { indicator },
                {}
            );
            let allMetas = await qrMetas.connection.query(query, parameters);
            console.log('TOTALES', allMetas);
            let queryRunnerNotApplicable = getConnection().createQueryBuilder();

            for (const meta of allMetas) {
                // let queryNotApplicable = `SELECT count(*) as count FROM ${meta.view_name} WHERE ${meta.col_name}  = "<Not applicable>"`;
                let queryNotApplicable = `SELECT count(*) as count FROM qa_evaluations qe
                    LEFT JOIN ${meta.view_name} qi on qe.indicator_view_id = qi.id AND qe.indicator_view_name = "${meta.view_name}"
                    WHERE ${meta.col_name}  = "<Not applicable>" AND qe.phase_year = actual_phase_year() AND qe.status <> "autochecked" `;

                if (crp_id != undefined && crp_id != 'undefined') {
                    queryNotApplicable += `AND qe.crp_id = '${crp_id}'`
                }

                totalEvaluationsByIndicator[meta.view_name][meta.display_name] = {
                    item: meta.display_name,
                    pending: meta.total, approved_without_comment: 0,
                    assessment_with_comments: 0,
                    notApplicable: null,
                    queryNotApplicable: queryNotApplicable
                };

                try {
                    const [query, parameters] = await queryRunnerNotApplicable.connection.driver.escapeQueryWithParameters(
                        totalEvaluationsByIndicator[meta.view_name][meta.display_name]['queryNotApplicable'],
                        {},
                        {}
                    );

                    let notApplicableCount = await queryRunnerNotApplicable.connection.query(query, parameters);
                    totalEvaluationsByIndicator[meta.view_name][meta.display_name]['notApplicable'] = +notApplicableCount[0].count;

                    totalEvaluationsByIndicator[meta.view_name][meta.display_name]['pending'] -= +notApplicableCount[0].count;
                } catch (error) {
                    console.log(error);

                }
            }


        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "All items status by indicators can not be retrived.", data: error });
        }

        let queryRunner = getConnection().createQueryBuilder();
        try {
            let queryAssessmentByField = '';
            if (crp_id != undefined && crp_id != 'undefined') {
                queryAssessmentByField = `SELECT display_name, col_name, approved_no_comment, indicator_view_name,
                SUM(
                   IF (approved_no_comment = 0, 1, 0)
                   ) AS pending,
               SUM(
                   IF (approved_no_comment = 1, 1, 0)
                   ) AS approved_without_comment,
               SUM(
                   IF (approved_no_comment is null, 1, 0)
                   ) AS assessment_with_comments,
                   count(distinct qe.id) as comments_distribution
               FROM qa_indicators_meta qim
               LEFT JOIN qa_comments qc ON qc.metaId = qim.id
               LEFT JOIN qa_evaluations qe ON qe.id = qc.evaluationId
               WHERE qim.id = qc.metaId
               AND qim.display_name  not like 'id'
               AND qim.enable_comments = 1
               AND qim.include_detail = 1
               AND qe.evaluation_status not like 'Removed'
               AND qe.phase_year = actual_phase_year()
               AND qe.indicator_view_name like :indicator
               AND qc.is_deleted = 0
               AND enable_comments <> 0
               AND qe.crp_id = :crp_id
               GROUP BY display_name, col_name, approved_no_comment, indicator_view_name, approved_no_comment;`
            } else {
                queryAssessmentByField = `SELECT display_name, col_name, approved_no_comment, indicator_view_name,
                SUM(
                   IF (approved_no_comment = 0, 1, 0)
                   ) AS pending,
               SUM(
                   IF (approved_no_comment = 1, 1, 0)
                   ) AS approved_without_comment,
               SUM(
                   IF (approved_no_comment is null, 1, 0)
                   ) AS assessment_with_comments,
                   count(distinct qe.id) as comments_distribution
               FROM qa_indicators_meta qim
               LEFT JOIN qa_comments qc ON qc.metaId = qim.id
               LEFT JOIN qa_evaluations qe ON qe.id = qc.evaluationId
               WHERE qim.id = qc.metaId
               AND qim.display_name  not like 'id'
               AND qim.enable_comments = 1
               AND qim.include_detail = 1
               AND qe.evaluation_status not like 'Removed'
               AND qe.phase_year = actual_phase_year()
               AND qe.indicator_view_name like :indicator
               AND qc.is_deleted = 0
               AND enable_comments <> 0
               GROUP BY display_name, col_name, approved_no_comment, indicator_view_name, approved_no_comment;`
            }
            const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                queryAssessmentByField, { indicator, crp_id }, {}
            );
            let allItems = await queryRunner.connection.query(query, parameters);
            for (let i = 0; i < allItems.length; i++) {



                switch (allItems[i].approved_no_comment) {
                    case 1:
                        totalEvaluationsByIndicator[allItems[i].indicator_view_name][allItems[i].display_name]['approved_without_comment'] = +allItems[i].approved_without_comment;
                        totalEvaluationsByIndicator[allItems[i].indicator_view_name][allItems[i].display_name]['pending'] -= +allItems[i].approved_without_comment;
                        break;
                    case null:
                        totalEvaluationsByIndicator[allItems[i].indicator_view_name][allItems[i].display_name]['assessment_with_comments'] = +allItems[i].assessment_with_comments;
                        totalEvaluationsByIndicator[allItems[i].indicator_view_name][allItems[i].display_name]['pending'] -= +allItems[i].comments_distribution;
                        break;
                    default:
                        break;
                }





            }
            console.log(totalEvaluationsByIndicator['qa_slo']);
            totalEvaluationsByIndicator[indicator] = Object.values(totalEvaluationsByIndicator[indicator]);
            res.status(200).send({ data: totalEvaluationsByIndicator[indicator], message: 'Items by indicator' });


        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Item status by indicators can not be retrived.", data: error });
        }
    }

    //ALL
    static getAllItemStatusByIndicator = async (req: Request, res: Response) => {
        let totalEvaluationsByIndicator = {
            qa_innovations: {},
            qa_policies: {},
            qa_publications: {},
            qa_oicr: {},
            qa_melia: {},
            qa_capdev: {},
            qa_milestones: {},
            qa_outcomes: {},
            qa_slo: {}
        };
        const indicators = Object.keys(GeneralIndicatorName);



        let qrMetas = getConnection().createQueryBuilder();
        try {
            const [query, parameters] = await qrMetas.connection.driver.escapeQueryWithParameters(
                `SELECT col_name, display_name, indicatorId, qi.view_name,
                    (SELECT count(*) FROM qa_evaluations qe WHERE qe.indicator_view_name = qi.view_name AND qe.phase_year = actual_phase_year() AND qe.status <> 'autochecked') AS total
                   FROM qa_indicators_meta qim
                   LEFT JOIN qa_indicators qi ON qi.id = qim.indicatorId
                   WHERE qim.display_name  not like 'id'
                   AND qim.enable_comments <> 0
                   AND qim.include_detail = 1`,
                {},
                {}
            );
            let allMetas = await qrMetas.connection.query(query, parameters);
            console.log('TOTALES', allMetas);

            allMetas.forEach(meta => {
                totalEvaluationsByIndicator[meta.view_name][meta.display_name] = { item: meta.display_name, pending: meta.total, approved_without_comment: 0, assessment_with_comments: 0 };
            });
        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "items by indicators can not be retrived.", data: error });
        }

        let queryRunner = getConnection().createQueryBuilder();
        try {

            const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                `SELECT display_name, col_name, approved_no_comment, indicator_view_name,
                SUM(
                   IF (approved_no_comment = 0, 1, 0)
                   ) AS pending,
               SUM(
                   IF (approved_no_comment = 1, 1, 0)
                   ) AS approved_without_comment,
               SUM(
                   IF (approved_no_comment is null, 1, 0)
                   ) AS assessment_with_comments
               FROM qa_indicators_meta qim
               LEFT JOIN qa_comments qc ON qc.metaId = qim.id
               LEFT JOIN qa_evaluations qe ON qe.id = qc.evaluationId
               WHERE qim.id = qc.metaId
               AND qim.display_name  not like 'id'
               AND qim.enable_comments = 1
               AND qe.evaluation_status not like 'Removed'
               AND qe.phase_year = actual_phase_year()
               AND qc.is_deleted = 0
               AND enable_comments <> 0
               GROUP BY display_name, col_name, approved_no_comment, indicator_view_name, approved_no_comment`
                ,
                {},
                {}
            );
            let allItems = await queryRunner.connection.query(query, parameters);
            let totalByItem = {};
            for (let i = 0; i < allItems.length; i++) {

                switch (allItems[i].approved_no_comment) {
                    case 1:
                        totalEvaluationsByIndicator[allItems[i].indicator_view_name][allItems[i].display_name]['approved_without_comment'] = allItems[i].approved_without_comment;
                        totalEvaluationsByIndicator[allItems[i].indicator_view_name][allItems[i].display_name]['pending'] -= allItems[i].approved_without_comment;
                        break;
                    case null:
                        totalEvaluationsByIndicator[allItems[i].indicator_view_name][allItems[i].display_name]['assessment_with_comments'] = allItems[i].assessment_with_comments;
                        totalEvaluationsByIndicator[allItems[i].indicator_view_name][allItems[i].display_name]['pending'] -= allItems[i].assessment_with_comments;
                        break;
                    default:
                        break;
                }
            }
            console.log(totalEvaluationsByIndicator['qa_slo']);

            res.status(200).send({ data: totalEvaluationsByIndicator, message: 'All items by indicator' });


        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "items by indicators can not be retrived.", data: error });
        }
    }

    static getItemListStatusMIS = async (req: Request, res: Response) => {
        const { crp_id, id } = req.params;

        // Annual Report year
        const { AR } = req.query;

        const indicatorRepository = getRepository(QAIndicators);
        const evaluationsRepository = getRepository(QAEvaluations);
        const batchesRepository = getRepository(QABatch);
        try {
            const indicator_view_name = await indicatorRepository.find({ where: { id: id }, select: ["view_name"] });

            // const evals = await getRepository(QAEvaluations)
            // .createQueryBuilder()
            // .select('eval')
            // .from(QAEvaluations, 'eval')
            // .leftJoinAndSelect('eval.comments', 'comments')
            // .where("eval.indicator_view_name = :view_name", {view_name: indicator_view_name[0].view_name})
            // .where("eval.crp_id = :crp_id", {crp_id})
            // .where("eval.evaluation_status <> :removed", {removed: 'Removed'})
            // .where("eval.phase_year = :AR", {AR})
            // .getMany();

            const evaluations = await evaluationsRepository.find(
                {
                    where: {
                        indicator_view_name: indicator_view_name[0].view_name,
                        crp_id,
                        evaluation_status: Not('Removed'),
                        phase_year: AR
                    },                    
                    select: ['indicator_view_name', 'indicator_view_id', 'crp_id', 'status', 'updatedAt', 'batchDate', 'require_second_assessment'],
                    relations: ['comments'],
                });

            const batches = await batchesRepository.find({where: {phase_year: AR}});

            

            const data = evaluations.map(e  => ({
                indicator_name: e.indicator_view_name.split('qa_')[1],
                id: e.indicator_view_id,
                crp_id: e.crp_id,
                assessment_status: Util.calculateStatusMIS(e,batches),
                updatedAt: e.updatedAt
            })
            );

            res.status(200).send({ data: data, message: `List of ${indicator_view_name[0].view_name.split('qa_')[1]} indicator items` })
        } catch (error) {
            res.status(404).json({ message: "Items for MIS cannot be retrieved", data: error })
        }

    }

/**
 * @api {get} /indicator/:indicator_id/crp/:smo_code/items?AR=:year Request User information
 * @apiName getItemStatusMIS
 * @apiGroup Indicators
 *
 * @apiParam {Number} indicator_id
 * @apiParam {String} smo_code
 * @apiParam {String} year
 * 
 * @apiSuccess {String} indicator_name Name of the indicator.
 * @apiSuccess {String} id  Item ID.
 * @apiSuccess {String} crp_id CRP ID.
 * @apiSuccess {String} assessment_status Item Status in QA Platform
 * @apiSuccess {Datetime} updatedAt last date of item update.
 */
    static getItemStatusMIS = async (req: Request, res: Response) => {
        const { crp_id, id, item_id } = req.params;

        // Annual Report year
        const { AR } = req.query;

        const indicatorRepository = getRepository(QAIndicators);
        const evaluationsRepository = getRepository(QAEvaluations);
        const batchesRepository = getRepository(QABatch);

        try {
            const indicator_view_name = await indicatorRepository.find({ where: { id: id }, select: ["view_name"] });
            const item = await evaluationsRepository.findOne(
                {
                    where: {
                        indicator_view_name: indicator_view_name[0].view_name,
                        indicator_view_id: item_id,
                        crp_id,
                        evaluation_status: Not('Removed'),
                        phase_year: AR
                    },
                    select: ['indicator_view_name', 'indicator_view_id', 'crp_id', 'status', 'updatedAt', 'batchDate', 'require_second_assessment']
                });

            const batches = await batchesRepository.find({where: {phase_year: AR}});

            const data = {
                indicator_name: item.indicator_view_name.split('qa_')[1],
                id: item.indicator_view_id,
                crp_id: item.crp_id,
                assessment_status: Util.calculateStatusMIS(item,batches),
                updatedAt: item.updatedAt
            }

            res.status(200).send({ data: data, message: `Item ${data.id} of  ${indicator_view_name[0].view_name.split('qa_')[1]} indicator.` })
        } catch (error) {
            res.status(404).json({ message: "Items for MIS cannot be retrieved", data: error })
        }

    }

}

export default IndicatorsController;