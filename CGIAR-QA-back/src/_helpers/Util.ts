
import { StatusHandler } from "@helpers/StatusHandler";
const { ErrorHandler } = require("@helpers/ErrorHandler")

import { DisplayTypeHandler } from "@helpers/DisplayTypeHandler";
import { RolesHandler } from "@helpers/RolesHandler";
import { getRepository, getConnection, createQueryBuilder, In } from "typeorm";
import { QAUsers } from "@entity/User";
import { QARoles } from "@entity/Roles";
import { QACrp } from "@entity/CRP";
import { QAGeneralConfiguration } from "@entity/GeneralConfig";
import { config } from "process";
import config_ from "@config/config";
import { QAIndicators } from "@entity/Indicators";
import { QAIndicatorsMeta } from "@entity/IndicatorsMeta";
import { QAEvaluations } from "@entity/Evaluations";
import { QAIndicatorUser } from "@entity/IndicatorByUser";

import * as jwt from "jsonwebtoken";
import * as excel from 'exceljs';
import { QAComments } from "@entity/Comments";
import { QACycle } from "@entity/Cycles";
import { QATags } from "@entity/Tags";
import { QATagType } from "@entity/TagType";
import AuthController from "@controllers/AuthController";
import { BaseError } from "./BaseError";
import { HttpStatusCode } from "./Constants";
// const excel = require('exceljs');


class Util {

    /***
     * 
     *  INTERNAL FUNCTIONS
     * 
     ***/
    
    static login = async (username:string, password:string) => {
        let user;
            //Get user from database
            const userRepository = getRepository(QAUsers);
            const grnlConfg = getRepository(QAGeneralConfiguration);
            const cycleRepo = getRepository(QACycle);

            username = username.trim().toLowerCase();

            let marlo_user = await userRepository.findOne({
                where: [
                    { email: username, is_marlo: 1 },
                    { username, is_marlo: 1 },
                ]
            });

            // console.log(marlo_user, username, password)
            if (marlo_user) {
                let is_marlo = await AuthController.validateAD(marlo_user, password);
                if (is_marlo)
                    user = marlo_user;

            } else if (!(username && password)) {
                // res.status(404).json({ message: 'Missing required email and password fields.' })
                throw new BaseError(
                    'NOT FOUND',
                    HttpStatusCode.NOT_FOUND,
                    'Missing required email and password fields.',
                    true
                );
            } else {
                user = await userRepository.findOneOrFail({
                    where: [
                        { username },
                        { email: username }
                    ]
                });
            }
            if (user.roles.map(role => { return role.description }).find(r => r === RolesHandler.crp) && user.roles.map(role => { return role.description }).find(r => r === RolesHandler.assesor)) {
                throw new BaseError(
                    'UNAUTHORIZED',
                    HttpStatusCode.UNAUTHORIZED,
                    'User unauthorized',
                    true
                );
            }
            // get general config by user role
            let generalConfig = await grnlConfg
                .createQueryBuilder("qa_general_config")
                .select('*')
                .where(`roleId IN (${user.roles.map(role => { return role.id })})`)
                .andWhere("DATE(qa_general_config.start_date) <= CURDATE()")
                .andWhere("DATE(qa_general_config.end_date) > CURDATE()")
                .getRawMany();

            let current_cycle = await cycleRepo
                .createQueryBuilder("qa_cycle")
                .select('*')
                .where("DATE(qa_cycle.start_date) <= CURDATE()")
                .andWhere("DATE(qa_cycle.end_date) > CURDATE()")
                //.getSql();
                .getRawOne();
                
            //Check if encrypted password match
            if (!marlo_user && !user.checkIfUnencryptedPasswordIsValid(password)) {
                console.log(`Password does not match.`);
                throw new BaseError(
                    'NOT FOUND',
                    HttpStatusCode.NOT_FOUND,
                    'User password incorrect.',
                    true
                );
                
            }

            //Sing JWT, valid for ``config.jwtTime`` 
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                config_.jwtSecret,
                { expiresIn: config_.jwtTime }
            );

            user["token"] = token;
            user["config"] = generalConfig;
            user['cycle'] = current_cycle;
            // console.log(current_cycle)
            delete user.password;
            delete user.replies;
            //Send the jwt in the response
            return user;
    }

    static getType(status, isCrp?) {
        let res = ""
        switch (status) {
            case StatusHandler.Pending:
                res = 'danger'
                // res = isCrp ? 'success' : 'danger'
                break;
            case StatusHandler.Complete:
                res = 'success'
                // res = isCrp ? 'danger' : 'success'
                break;
            case StatusHandler.Finalized:
                res = 'info'
                // res = isCrp ? 'danger' : 'success'
                break;

            default:
                break;
        }

        return res;
    }

    static groupBy(array, key) {
        let result = array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(
                currentValue
            );
            return result;
        }, {});
        return result;
    };

    static parseEvaluationsData(rawData, type?) {
        let response = [];
        // console.log('parseEvaluationsData', type)
        for (let index = 0; index < rawData.length; index++) {
            if (!type) {
                response.push(this.formatResponse(rawData[index], type));
            }
            else if (!rawData[index]["meta_is_primay"] && rawData[index]['meta_include_detail']) {
                response.push(this.formatResponse(rawData[index], type));
            }
        }
        // console.log(response, type)
        return response;
    }

    static parseCommentData(rawData, type?) {
        let grouped_data = Util.groupBy(rawData, type);
        for (const key in grouped_data) {
            const element = grouped_data[key];
            if (grouped_data.hasOwnProperty(key)) {
                let itm = [
                    { indicator_view_name: key, label: 0, value: 0, type: 'warning', status: 'answered', enable_crp: element[0].enable_crp, enable_assessor: element[0].enable_assessor, primary_field: element[0].primary_field, total: element.length },
                    { indicator_view_name: key, label: 0, value: 0, type: 'info', status: 'unanswered', enable_crp: element[0].enable_crp, enable_assessor: element[0].enable_assessor, primary_field: element[0].primary_field, total: element.length },
                ];
                element.total = element.length;
                element.forEach(ele => {
                    if (parseInt(ele['count']) > 0) {
                        itm[0].value += 1;
                        itm[0].label += 1;
                    } else {
                        itm[1].value += 1;
                        itm[1].label += 1;
                    }
                });

                grouped_data[key] = itm;
            }
        }

        return grouped_data;
    }

    static parseChartData(rawData, type?) {
        let response = {
            label: [],
            data_set: [
                { data: [], label: 'CRP - Approved', sql_name: 'approved_comment_crp', backgroundColor: '#ffca30' },
                { data: [], label: 'CRP - Rejected', sql_name: 'rejected_comment_crp', backgroundColor: '#F1B7B7' },
                { data: [], label: 'CRP - No responded', sql_name: 'crp_no_commented', backgroundColor: '#0f8981' },
                { data: [], label: 'Assessor - Commented', sql_name: 'assessor_comments', backgroundColor: '#61b33e' },
                { data: [], label: 'Assessor - Approved without comment', sql_name: 'approved_no_comment', backgroundColor: '#2e7636' },
                { data: [], label: 'Total', sql_name: 'comments_total', backgroundColor: '#b73428' },
            ]
        };

        for (let index = 0; index < rawData.length; index++) {
            const element = rawData[index]
            const indicator_name = element['indicator_view_name'].split('qa_')[1];
            response['label'].push(indicator_name);

            response.data_set.forEach(set => {
                set.data.push(element[set.sql_name])
            });
        }
        // console.log(response)
        return response;
    }


    static createOrReturnUser = async (authToken: any): Promise<any> => {
        const userRepository = getRepository(QAUsers);
        const roleRepository = getRepository(QARoles);
        const crpRepository = getRepository(QACrp);
        const grnlConfg = getRepository(QAGeneralConfiguration);
        const cycleRepo = getRepository(QACycle);
        let queryRunner = getConnection().createQueryBuilder();
        let user: QAUsers;
        try {

            user = await userRepository.findOne({ where: { email: authToken.email } });
            let crp = await crpRepository.findOneOrFail({ where: { crp_id: authToken.crp_id } });
            let crpRole = await roleRepository.findOneOrFail({ where: { description: RolesHandler.crp } });

            if (!user) {
                user = new QAUsers();
                user.password = '';
                user.username = authToken.username;
                user.email = authToken.email;
                user.name = authToken.name;
                user.crp = crp;
                user.crps = [crp];
                user.roles = [crpRole];
                // user.crps = user.crps.concat(crp);
                // user.roles = user.roles.concat(crpRole);
                user = await userRepository.save(user);
            }

            const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                `SELECT
                    *
                FROM
                    qa_user_crps
                WHERE
                    qa_crp = :crpId
                AND qa_user = :userId
                    `,
                { crpId: authToken.qa_crp_id, userId: user.id },
                {}
            );
            let user_crp = await queryRunner.connection.query(query, parameters);
            // console.log('user_crp')
            // console.log(user_crp)
            if (user && user_crp.length === 0) {
                user.crps = user.crps.concat(crp);
                user.roles = user.roles.concat(crpRole);
                user = await userRepository.save(user);
            }

            // console.log(user, user_crp, crpRole);

            //  // get general config by user role
            let generalConfig = await grnlConfg
                .createQueryBuilder("qa_general_config")
                .select('*')
                .where(`roleId IN (${user.roles.map(role => { return role.id })})`)
                .andWhere("DATE(qa_general_config.start_date) <= CURDATE()")
                .andWhere("DATE(qa_general_config.end_date) > CURDATE()")
                .getRawMany();

            let current_cycle = await cycleRepo
                .createQueryBuilder("qa_cycle")
                .select('*')
                .where("DATE(qa_cycle.start_date) <= CURDATE()")
                .andWhere("DATE(qa_cycle.end_date) > CURDATE()")
                .getRawOne();

            // //Sing JWT, valid for ``config.jwtTime`` 
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                config_.jwtSecret,
                { expiresIn: config_.jwtTime }
            );


            user["token"] = token;
            user["config"] = generalConfig;
            user['cycle'] = current_cycle;
            delete user.replies;
            delete user.password;
            return user
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }



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
                    // evaluations.indicator_user = indiByUsr;
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

    static createCommentsExcel = async (headers: Partial<excel.Column>[], rows: any[], sheetName: string, indicatorName: string): Promise<Buffer> => {

        try {
            const workbook: excel.stream.xlsx.WorkbookWriter = new excel.stream.xlsx.WorkbookWriter({});
            const sheet: excel.Worksheet = workbook.addWorksheet(sheetName);
            sheet.columns = headers;
            for (let i = 0; i < rows.length; i++) {
                if (rows[i]) {
                    let col_name = rows[i].col_name;
                    let field_value;
                    try{
                        let queryRunner = getConnection().createQueryBuilder();

                        const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                            `SELECT
                            clean_html_tags(${col_name}) as col_name
                            FROM
                            ${indicatorName} 
                            WHERE id = ${rows[i].id}
                            AND phase_year = actual_phase_year()                        
                                `,
                            { },
                            {}
                        );
                    field_value = await queryRunner.connection.query(query, parameters);
                    // field_value = JSON.parse(JSON.stringify(response[0]))[col_name];
                    console.log(field_value);
                            
                    } catch(error){
                        console.log(error);         
                    }
                    let row = {
                        id: rows[i].id,
                        indicator_title: rows[i].indicator_title,
                        createdAt: rows[i].createdAt,
                        updatedAt: rows[i].updatedAt,
                        comment: rows[i].detail,
                        user: rows[i].username,
                        field: rows[i].display_name ? rows[i].display_name : 'General Comment',
                        value: field_value[0].col_name || '',
                        crp_approved: (rows[i].crp_approved != null) ? ((rows[i].crp_approved == 1) ? 'Yes' : 'No') : '',
                        reply: rows[i].reply,
                        user_replied: rows[i].reply_user,
                        reply_createdAt: rows[i].reply_createdAt,
                        comment_id: rows[i].comment_id,
                        cycle_stage: rows[i].cycle_stage,
                    };
                    sheet.addRow(row);

                }
            }
            sheet.commit();
            return new Promise((resolve, reject): void => {
                workbook.commit().then(() => {
                    const stream: any = (workbook as any).stream;
                    const result: Buffer = stream.read();
                    resolve(result);
                }).catch((e) => {
                    reject(e);
                });
            });
        } catch (error) {
            console.log(error)
        }

    }
    static createRawCommentsExcel = async (headers: Partial<excel.Column>[], rows: any[], sheetName: string): Promise<Buffer> => {

        try {
            const workbook: excel.stream.xlsx.WorkbookWriter = new excel.stream.xlsx.WorkbookWriter({});
            const sheet: excel.Worksheet = workbook.addWorksheet(sheetName);
            sheet.columns = headers;
            for (let i = 0; i < rows.length; i++) {
                if (rows[i]) {
                    let col_name = rows[i].col_name;
                    let field_value;
                    try{
                        let queryRunner = getConnection().createQueryBuilder();

                        const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                            `SELECT
                            clean_html_tags(${col_name}) as col_name
                            FROM
                            ${rows[i].indicator_view_name} 
                            WHERE id = ${rows[i].id}
                            AND phase_year = actual_phase_year()                        
                                `,
                            { },
                            {}
                        );
                    field_value = await queryRunner.connection.query(query, parameters);
                    // field_value = JSON.parse(JSON.stringify(response[0]))[col_name];
                    // console.log(field_value);
                            
                    } catch(error){
                        console.log(error);         
                    }
                    let row = {
                        id: rows[i].id,
                        crp_acronym: rows[i].crp_acronym,
                        indicator_title: rows[i].indicator_title,
                        createdAt: rows[i].createdAt,
                        updatedAt: rows[i].updatedAt,
                        comment: rows[i].detail,
                        assessor: rows[i].username,
                        field: rows[i].display_name ? rows[i].display_name : 'General Comment',
                        value: field_value[0].col_name || '',
                        // crp_approved: rows[i].crp_approved,
                        crp_approved: (rows[i].crp_approved != null) ? ((rows[i].crp_approved == 1) ? 'Yes' : 'No') : '<not replied>',
                        reply: rows[i].reply,
                        user_replied: rows[i].user_replied,
                        reply_createdAt: rows[i].reply_createdAt,
                        comment_id: rows[i].comment_id,
                        cycle_stage: rows[i].cycle_stage,
                    };
                    sheet.addRow(row);

                }
            }
            sheet.commit();
            return new Promise((resolve, reject): void => {
                workbook.commit().then(() => {
                    const stream: any = (workbook as any).stream;
                    const result: Buffer = stream.read();
                    resolve(result);
                }).catch((e) => {
                    reject(e);
                });
            });
        } catch (error) {
            console.log(error)
        }

    }

    static createComment = async (detail, approved, userId, metaId, evaluationId) => {
        const userRepository = getRepository(QAUsers);
        const metaRepository = getRepository(QAIndicatorsMeta);
        const evaluationsRepository = getRepository(QAEvaluations);
        const commentsRepository = getRepository(QAComments);
        const cycleRepo = getRepository(QACycle);
        try {

            let user = await userRepository.findOneOrFail({ where: { id: userId } });
            let meta;
            if (metaId != null)
                meta = await metaRepository.findOneOrFail({ where: { id: metaId } });
            let evaluation = await evaluationsRepository.findOneOrFail({ where: { id: evaluationId }, relations: ['assessed_by', 'assessed_by_second_round']  });

            let current_cycle = await cycleRepo
                .createQueryBuilder("qa_cycle")
                .select('*')
                .where("DATE(qa_cycle.start_date) <= CURDATE()")
                .andWhere("DATE(qa_cycle.end_date) > CURDATE()")
                .getRawOne();
            
            
                if(current_cycle.id == 1) {
                    evaluation.assessed_by.push(user);
                console.log('ASSESSORS',evaluation.assessed_by);

                } else {
                    evaluation.assessed_by_second_round.push(user);
                }
                evaluationsRepository.save(evaluation);

            console.log(current_cycle == undefined)
            if (current_cycle == undefined) throw new Error('Could not created comment')
            let comment_ = new QAComments();
            comment_.detail = detail;
            comment_.approved = approved;
            comment_.meta = meta;
            comment_.evaluation = evaluation;
            comment_.user = user;
            comment_.cycle = current_cycle;
            let new_comment = await commentsRepository.save(comment_);

            return new_comment;
        } catch (error) {
            // console.log(error)
            return null;
        }
    }

    static createTag = async ( userId, tagTypeId, commentId) => {
        const userRepository = getRepository(QAUsers);
        const commentsRepository = getRepository(QAComments);
        const tagsRepository = getRepository(QATags);
        const tagTypeRepository = getRepository(QATagType);

        try {

            let user = await userRepository.findOneOrFail({ where: { id: userId } });
            let tagType = await tagTypeRepository.findOneOrFail({ where: { id: tagTypeId } });
            let comment = await commentsRepository.findOneOrFail({ where: { id: commentId } });

            let tag_ = new QATags();
            tag_.user = user;
            tag_.tagType = tagType;
            tag_.comment = comment;

            let new_tag = await tagsRepository.save(tag_);

            return new_tag;
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    static getTagId = async (commentId, tagTypeId, userId) => {

        let queryRunner = getConnection().createQueryBuilder();
        try {

            const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                `SELECT tag.id as tagId
                FROM qa_tags tag 
                JOIN qa_tag_type tt ON tt.id = tag.tagTypeId
                JOIN qa_users us ON us.id = tag.userId
                WHERE tag.commentId = :commentId
                AND tag.tagTypeId= :tagTypeId
                AND tag.userId= :userId;
                        `,
                { commentId, tagTypeId, userId},
                {}
            );

            let tagId = await queryRunner.connection.query(query, parameters);
            console.log('TagID' ,tagId);
            
            return tagId[0].tagId || [];
        } catch(error) {
            console.log(error);
            return null;
        }

    }


    private static formatResponse = (element, type) => {
        let field = element["meta_col_name"];
        let value = '';
        if(element[`${field}`] == '<Not applicable>' && element["replies_count"] > 0) {
            value = ' ';
        }else {
            value = element[`${field}`];
        }
        var response = {
            comments_replies_count: element["comments_replies_count"],
            comments_accepted_count: element["comments_accepted_count"],
            comments_accepted_with_comment_count: element["comments_accepted_with_comment_count"],
            comments_disagreed_count: element["comments_disagreed_count"],
            comments_clarification_count: element["comments_clarification_count"],
            comments_count: element["comments_count"],
            evaluation_id: element["evaluation_id"],
            status: element["evaluations_status"],
            response_status: element["response_status"],
            evaluation_status: element["evaluation_status"],
            crp_name: element["crp_name"],
            crp_acronym: element["crp_acronym"],
            crp_accepted: element["crp_accepted"],
            crp_rejected: element["crp_rejected"],
            assessment_status: element["assessment_status"],
        }
        if (!type) {
            response = Object.assign(response, {
                indicator_view_name: element['indicator_view_name'],
                type: Util.getType(element['evaluations_status']),
                id: element['indicator_view_id'],
                display_name: element["meta_display_name"],
                title: element['title'],
                comment_by: element['comment_by'],
                assessed_r2: element['assessed_r2'],
                stage: element.hasOwnProperty('stage') ? element['stage'] : undefined,
                fp: element.hasOwnProperty('fp') ? element['fp'] : undefined,
                brief: element.hasOwnProperty('brief') ? element['brief'] : undefined, //TODO
            });
        } else {
            response = Object.assign(response, {
                enable_comments: (element["meta_enable_comments"] === 1) ? true : false,
                col_name: element["meta_col_name"],
                display_name: element["meta_display_name"],
                display_type: DisplayTypeHandler.Paragraph,
                value: value,
                field_id: element["meta_id"],
                // evaluation_id: element["evaluation_id"],
                general_comment: element["general_comment"],
                general_comment_id: element["general_comment_id"],
                general_comment_user: element["general_comment_user"],
                general_comment_updatedAt: element["general_comment_updatedAt"],
                enable_assessor: element['enable_assessor'],
                enable_crp: element['enable_crp'],
                replies_count: element['replies_count'],
                approved_no_comment: element['approved_no_comment'] || null,
                public_link: element[`public_link`],
                editable_link: element[`editable_link`],
                meta_description: element['meta_description'],
                comments_count: element["comments_count"],
                count_accepted_comments: element['accepted_comments'],
                count_disagree_comments: element['disagree_comments'],
                count_clarification_comments: element['clarification_comments'],
                count_accepted_with_comments: element['accepted_with_comments'],
            });

        }

        return response;
    }

}

export default Util;