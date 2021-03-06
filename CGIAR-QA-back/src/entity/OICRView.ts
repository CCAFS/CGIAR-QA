import { ViewEntity, ViewColumn } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

/**
 * included_AR = 'Yes'
        AND included_AR = 'No' 
        AND
 */
@ViewEntity({
    expression: `
        SELECT * FROM qa_oicr_data  
        WHERE  phase_name = 'AR'
        AND phase_year = actual_phase_year()
    `
})


export class QAOicr {
   
    @ViewColumn()
    crp_id: string;

    @ViewColumn()
    phase_name: string;
    
    @ViewColumn()
    phase_year: string;
    
    @ViewColumn()
    included_AR: string;
    
    @ViewColumn()
    title: string;

    @ViewColumn()
    id: number;

    @ViewColumn()
    tag: string;
    
    @ViewColumn()
    outcome_impact_statement: string;
    
    @ViewColumn()
    comunications_material: string;
    
    @ViewColumn()
    policies: string;
    
    @ViewColumn()
    maturity_level: string;
    
    @ViewColumn()
    shared_oicr: string;

    @ViewColumn()
    sub_idos: string;
    
    @ViewColumn()
    srf_targets: string;
    
    @ViewColumn()
    geographic_scope: string;
    
    @ViewColumn()
    regions: string;
    
    @ViewColumn()
    countries: string;
    
    @ViewColumn()
    contrib_crp: string;
    
    @ViewColumn()
    contrib_fp: string;
    
    @ViewColumn()
    partners: string;
    
    @ViewColumn()
    innovations: string;
    
    @ViewColumn()
    milestones: string;
    
    @ViewColumn()
    elaboration_outcome_impact_statement: string;
    
    @ViewColumn()
    references_text: string;
    
    @ViewColumn()
    gender: string;
    
    @ViewColumn()
    gender_relevance: string;
    
    @ViewColumn()
    youth: string;
    
    @ViewColumn()
    youth_relevance: string;
    
    @ViewColumn()
    capdev: string;
    
    @ViewColumn()
    capdev_relevance: string;
    
    @ViewColumn()
    climate: string;
    
    @ViewColumn()
    climate_relevance: string;
    
    @ViewColumn()
    cgiar_innovation : string;

    @ViewColumn()
    editable_link: string;

    @ViewColumn()
    public_link: string;
}