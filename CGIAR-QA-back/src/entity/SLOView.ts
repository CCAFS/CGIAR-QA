import { ViewEntity, ViewColumn, Column } from "typeorm";

@ViewEntity({
    expression: `
        SELECT * FROM qa_slo_targets_view  
        WHERE phase_name = 'AR'
        AND phase_year = '2020'
    `
})


export class QASlo {

    @ViewColumn()
    crp_id: string;

    @ViewColumn()
    phase_name: string;

    @Column({ default: 'SLO' })
    title: string;

    @ViewColumn()
    phase_year: string;

    @ViewColumn()
    id: number;

    @ViewColumn()
    slo_target_id: string;

    // @ViewColumn()
    // slo_target: string;

    @ViewColumn()
    biref_summary: string;

    @ViewColumn()
    additional_contribution: string;

    @ViewColumn()
    editable_link: string;

    @ViewColumn()
    public_link: string;

}