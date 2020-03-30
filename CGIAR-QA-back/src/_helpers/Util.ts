
import { StatusHandler } from "@helpers/StatusHandler";
import { DisplayTypeHandler } from "@helpers/DisplayTypeHandler";
import { RolesHandler } from "@helpers/RolesHandler";

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
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(
                currentValue
            );
            return result;
        }, {});
    };

    static parseEvaluationsData(rawData, type?) {
        let response = [];
        // console.log('parseEvaluationsData', type)
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
            case "policies":
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
                        type: Util.getType(element['evaluations_status']),
                        value: element['count'],
                        id: element['evaluations_indicator_view_id'],
                        title: element['title'],
                        pdf: element['pdf'] ? element['pdf'] : 'pdf_URL',
                        crp: element['crp_name'],
                    })

                }

                break;
        }

        return response;
    }

    static parseCommentData(rawData, type?) {
        let grouped_data = Util.groupBy(rawData, type);
        for (const key in grouped_data) {
            const element = grouped_data[key];
            if (grouped_data.hasOwnProperty(key)) {
                let itm = [
                    { indicator_view_name: key, label: 0, value: 0, type: 'warning',status: 'answered', total: element.length },
                    { indicator_view_name: key, label: 0, value: 0, type: 'info',status: 'unanswered', total: element.length },
                ];
                element.total = element.length;
                element.forEach(ele => {
                    console.log(parseInt(ele['count']) > 0)
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
}

export default Util;