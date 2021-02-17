import { ViewEntity, ViewColumn } from "typeorm";


@ViewEntity({
    expression: `
        SELECT * FROM qa_outcomes_view
        WHERE phase_name = 'AR'
        AND phase_year = '2020'
    `
})


export class QAOutcomes {

    @ViewColumn()
    crp_id: string;

    @ViewColumn()
    phase_name: string;

    @ViewColumn()
    phase_year: string;

    @ViewColumn()
    id: number;

    @ViewColumn()
    title: string;

    @ViewColumn()
    fp: string;
    
    @ViewColumn()
    outcome_description: string;
    
    @ViewColumn()
    sub_idos: string;
    
    @ViewColumn()
    progress_outcome: string;

    @ViewColumn()
    editable_link: string;

}