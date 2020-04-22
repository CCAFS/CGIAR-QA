import { ViewEntity, ViewColumn } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";


@ViewEntity({
    expression: `
        SELECT * FROM qa_milestones_view 
        
        WHERE phase_name = 'AR'
        AND phase_year = '2019'
    `
})

//WHERE included_AR = 'Yes' 

export class QAMilestones {

    @ViewColumn()
    id: number;
   
    @ViewColumn()
    crp_id: string;

    @ViewColumn()
    phase_name: string;
    
    @ViewColumn()
    phase_year: string;
    
    @ViewColumn()
    fp: string;
    
    @ViewColumn()
    outcome_description: string;
    
    @ViewColumn()
    title: string;
    
    @ViewColumn()
    sub_idos: string;
    
    @ViewColumn()
    progress_outcome: string;
    
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
    capdev_level_justification: string;
    
    @ViewColumn()
    climate_level: string;

    @ViewColumn()
    climate_level_justification: string;

    @ViewColumn()
    editable_link: string;

    @ViewColumn()
    public_link: string;
}