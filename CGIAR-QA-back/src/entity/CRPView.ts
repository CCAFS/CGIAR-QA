import { ViewEntity, ViewColumn } from "typeorm";


@ViewEntity({
    expression: `
            SELECT
                crp.id, crp.createdAt, crp.updatedAt, crp.name, crp.crp_id, crp.acronym, crp.is_marlo, crp.active,
            IF (
                is_active = NULL
                OR is_active = 0,
                'close',
                'open'
            ) qa_active
            FROM
                qa_crp crp
            LEFT JOIN qa_submitted_crps_view s ON s.crp_id = crp.crp_id
    `
})


export class QACrpView {

    @ViewColumn()
    id: number;

    @ViewColumn()
    createdAt: Date;

    @ViewColumn()
    updatedAt: Date;

    @ViewColumn()
    name: string;

    @ViewColumn()
    crp_id: string;

    @ViewColumn()
    acronym: string;

    @ViewColumn()
    is_marlo: boolean;


    @ViewColumn()
    active: boolean;

    @ViewColumn()
    qa_active: string;

}