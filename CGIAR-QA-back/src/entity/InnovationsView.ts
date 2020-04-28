import { ViewEntity, ViewColumn } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";


@ViewEntity({
    expression: `
        SELECT * FROM qa_innovations_data
        WHERE included_AR = 'Yes' 
        AND phase_name = 'AR'
        AND phase_year = '2019'
    `
})

export class QAInnovations{
    @ViewColumn()
    crp_id: string;
    
    @ViewColumn()
    phase_name: string;

    @ViewColumn()
    phase_year: string;

    @ViewColumn()
    included_AR: string;

    @ViewColumn()
    id: number;
    // project_innovation_id: number;

    @ViewColumn()
    title: string;

    @ViewColumn()
    narrative: string;

    @ViewColumn()
    year: number;

    @ViewColumn()
    stage: string;
    
    @ViewColumn()
    description_stage: string;
    
    @ViewColumn()
    innovation_type: string;
    
    @ViewColumn()
    number_of_innovations: number;
    
    @ViewColumn()
    geographic_scope:string
    
    @ViewColumn()
    regions:string

    @ViewColumn()
    countries: string;
    
    @ViewColumn()
    is_clear_lead:string

    @ViewColumn()
    leader: string;

    @ViewColumn()
    contributors: string;
    
    @ViewColumn()
    milestones: string;

    @ViewColumn()
    sub_ido: string;
    
    @ViewColumn()
    contrib_crp: string;

    @ViewColumn()
    evidence_link: string;
    
    @ViewColumn()
    public_link: string;
    // pdf: string;
    
    @ViewColumn()
    editable_link: string;
    // link: string;
    
}