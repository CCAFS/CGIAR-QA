import { ViewEntity, ViewColumn } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
/**
 * included_AR = 'Yes'
        AND included_AR = 'No' 
        AND 
 */

@ViewEntity({
    expression: `
        SELECT * FROM qa_policies_data
        WHERE phase_name = 'AR'
        AND phase_year = '2020'
    `
})


export class QAPolicies {

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

    @ViewColumn()
    title: string;

    @ViewColumn()
    description: string;

    @ViewColumn()
    narrative_evidence: string;

    @ViewColumn()
    year: number;

    @ViewColumn()
    policy_type: string;
    
    @ViewColumn()
    maturity_level: string;
    
    @ViewColumn()
    policy_owners: string;
    
    @ViewColumn()
    sub_idos: string;
    
    @ViewColumn()
    contrib_crp: string;
    
    @ViewColumn()
    gender: string;

    @ViewColumn()
    youth: string;

    @ViewColumn()
    capdev: string;
    
    @ViewColumn()
    climate: string;
    
    @ViewColumn()
    geographic_scope: string;
    
    @ViewColumn()
    regions: string;
   
    @ViewColumn()
    countries: string;
    
    @ViewColumn()
    editable_link: string;

    @ViewColumn()
    public_link: string;
    
    @ViewColumn()
    OICR: string;
    
    @ViewColumn()
    milestones: string;
    
    @ViewColumn()
    innovations: string;
    
    @ViewColumn()
    shared_policy: string;







}