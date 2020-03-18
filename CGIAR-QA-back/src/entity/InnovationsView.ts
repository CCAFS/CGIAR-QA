import { ViewEntity, ViewColumn } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";


@ViewEntity({
    expression: `
        SELECT * FROM qa_innovations_view 
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
    project_innovation_id: number;

    @ViewColumn()
    title: string;

    @ViewColumn()
    narrative: string;

    @ViewColumn()
    year: number;

    @ViewColumn()
    stage: string;

    @ViewColumn()
    evidence_link: string;

    @ViewColumn()
    number_of_innovations: number;
    
    @ViewColumn()
    countries: string;
    
    @ViewColumn()
    pdf: string;
        
    @ViewColumn()
    link: string;
    
    @ViewColumn()
    contrib_crp: string;
    
    @ViewColumn()
    contributors: string;
    
    @ViewColumn()
    leader: string;
    
    @ViewColumn()
    is_clear_lead:string
    
    @ViewColumn()
    regions:string
    
    @ViewColumn()
    geographic_scope:string
    
    @ViewColumn()
    description_stage:string
    


}