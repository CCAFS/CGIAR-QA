
import { StatusHandler } from "@helpers/StatusHandler";
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
// const excel = require('exceljs');


class Util {

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
        let response = [];
        for (let index = 0; index < rawData.length; index++) {
            const element = rawData[index]
            const indicator_name = element['indicator_view_name'].split('qa_')[1];

            let a = response.find(data => data.name == indicator_name)
            console.log(a)
            if (!a) {
                let r = {
                    name: indicator_name,
                    indicator_name: element['indicator_view_name'],
                    series: [

                        {
                            "name": type == 'admin' ? "Comments Approved" : "Comments Received",
                            "value": element['comments_approved']
                        },
                        {
                            "name": "Comments Approved No Comment",
                            "value": element['approved_no_comment']
                        },
                        {
                            "name": "Comments CRP Approved",
                            "value": element['approved_comment_crp']
                        },
                        // {
                        // "name": "Comments CRP Approved",
                        // "value": element['approved_comment_crp']
                        // },
                    ]
                }

                if (type == 'admin') {
                    r.series.unshift({
                        "name": "Total Comments",
                        "value": element['comments_total']
                    })
                }

                response.push(r)
            }
        }
        return response;
    }


    static createOrReturnUser = async (authToken: any): Promise<any> => {
        const userRepository = getRepository(QAUsers);
        const roleRepository = getRepository(QARoles);
        const crpRepository = getRepository(QACrp);
        const grnlConfg = getRepository(QAGeneralConfiguration);
        let queryRunner = getConnection().createQueryBuilder();
        let user: QAUsers;
        try {

            user = await userRepository.findOne({ where: { email: authToken.email } });
            let crp = await crpRepository.findOneOrFail({ where: { crp_id: authToken.crp_id } });
            let crpRole = await roleRepository.findOneOrFail({ where: { description: RolesHandler.crp } });
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
            if (!user) {
                user = new QAUsers();
                user.password = '';
                user.username = authToken.username;
                user.email = authToken.email;
                user.name = authToken.name;
                user.crps = user.crps.concat(crp);
                user.roles = user.roles.concat(crpRole);
                user = await userRepository.save(user);
            }
            else if (user && user_crp.length === 0) {
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

            // //Sing JWT, valid for ``config.jwtTime`` 
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                config_.jwtSecret,
                { expiresIn: config_.jwtTime }
            );


            user["token"] = token;
            user["config"] = generalConfig;

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

    static createCommentsExcel = async (headers: Partial<excel.Column>[], rows: any[], sheetName: string): Promise<Buffer> => {

        try {
            const workbook: excel.stream.xlsx.WorkbookWriter = new excel.stream.xlsx.WorkbookWriter({});
            const sheet: excel.Worksheet = workbook.addWorksheet(sheetName);
            sheet.columns = headers;
            for (let i = 0; i < rows.length; i++) {
                if (rows[i]) {
                    let row = {
                        id: rows[i].id,
                        createdAt: rows[i].createdAt,
                        comment: rows[i].detail,
                        user: rows[i].user.name,
                        // email: rows[i].user.email,
                        field: rows[i].meta ? rows[i].meta.display_name : 'General Comment',
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


    private static formatResponse = (element, type) => {
        let field = element["meta_col_name"];
        var response = {
            comments_count: element["comments_count"],
            crp_acronym: element["crp_acronym"],
            evaluation_id: element["evaluation_id"],
            crp_name: element["crp_name"],
            status: element["evaluations_status"],
        }
        if (!type) {
            response = Object.assign(response, {
                indicator_view_name: element['indicator_view_name'],
                type: Util.getType(element['evaluations_status']),
                id: element['indicator_view_id'],
                display_name: element["meta_display_name"],
                title: element['title'],
                comment_by: element['comment_by'],
                stage: element.hasOwnProperty('stage') ? element['stage'] : undefined,
            });
        } else {
            response = Object.assign(response, {
                enable_comments: (element["meta_enable_comments"] === 1) ? true : false,
                col_name: element["meta_col_name"],
                display_name: element["meta_display_name"],
                display_type: DisplayTypeHandler.Paragraph,
                value: element[`${field}`],
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
                meta_description: element['meta_description']
            });

        }

        return response;
    }

}

export default Util;