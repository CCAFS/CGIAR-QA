import { ViewEntity, ViewColumn } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";


@ViewEntity({
    expression: `
        SELECT * FROM qa_innovations_view 
        WHERE included_AR = 'Yes' 
        AND phase_name = 'AR'
    `
})
export class QAInnovations{
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
    project_innovation_id: number;

    @ViewColumn()
    title: string;

    @ViewColumn()
    narrative: string;

    @ViewColumn()
    year: number;

    @ViewColumn()
    evidence_link: string;

    @ViewColumn()
    number_of_innovations: number;
    
    @ViewColumn()
    countries: string;
    
    @ViewColumn()
    pdf: string;
}