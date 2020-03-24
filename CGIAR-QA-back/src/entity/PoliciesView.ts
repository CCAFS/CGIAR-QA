import { ViewEntity, ViewColumn } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";


@ViewEntity({
    expression: `
        SELECT * FROM qa_policies_view 
        WHERE included_AR = 'Yes' 
        AND phase_name = 'AR'
    `
})


export class QAPolicies {

    @ViewColumn()
    crp_id: string;

    // @ViewColumn()
    // crp: string;

    @ViewColumn()
    phase_name: string;

    @ViewColumn()
    phase_year: string;

    @ViewColumn()
    included_AR: string;

    @ViewColumn()
    //policy_id: number;
    policy_id: number;

    @ViewColumn()
    title: string;

    @ViewColumn()
    narrative_evidence: string;
    //evidence_link: string;

    @ViewColumn()
    year: number;

    @ViewColumn()
    policy_type: string;
    
    @ViewColumn()
    maturity_level: string;
    
    @ViewColumn()
    policy_owners: string;
    
    @ViewColumn()
    sub_ido: string;
    
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
    link: string;
}