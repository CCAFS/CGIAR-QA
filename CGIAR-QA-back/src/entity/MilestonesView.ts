import { ViewEntity, ViewColumn } from "typeorm";


@ViewEntity({
    expression: `
        SELECT * FROM qa_milestones_data
        WHERE phase_name = 'AR'
        AND phase_year = '2019'
    `
})


export class QAMilestones {

    @ViewColumn()
    crp_id: string;

    @ViewColumn()
    phase_name: string;

    @ViewColumn()
    phase_year: string;

    @ViewColumn()
    id: number;

    @ViewColumn()
    fp: string;

    @ViewColumn()
    outcome_description: string;
    
    @ViewColumn()
    sub_idos: string;
    
    @ViewColumn()
    progress_outcome: string;
    
    @ViewColumn()
    title: string;
    
    @ViewColumn()
    status: string;
    
    @ViewColumn()
    status_reason: string;
    
    @ViewColumn()
    evidence: string;
    
    @ViewColumn()
    evidence_link: string;
    
    @ViewColumn()
    gender_level: string;
    
    @ViewColumn()
    gender_justification: string;
    
    @ViewColumn()
    youth_level: string;
    
    @ViewColumn()
    youth_justification: string;
    
    @ViewColumn()
    capdev_level: string;
    
    @ViewColumn()
    capdev_justification: string;
    
    @ViewColumn()
    climate_level: string;
    
    @ViewColumn()
    climate_justification: string;
    
    @ViewColumn()
    editable_link: string;


}