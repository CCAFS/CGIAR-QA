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

    @ViewColumn()
    crp: string;

    @ViewColumn()
    phase_name: string;

    @ViewColumn()
    phase_year: string;

    @ViewColumn()
    included_AR: string;

    @ViewColumn()
    //policy_id: number;
    project_innovation_id: number;

    @ViewColumn()
    title: string;

    @ViewColumn()
    //narrative_evidence: string;
    evidence_link: string;

    @ViewColumn()
    year: number;

    //@ViewColumn()
    //policy_type: string;
    
    @ViewColumn()
    countries: string;

}