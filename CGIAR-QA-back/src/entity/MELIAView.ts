import { ViewEntity, ViewColumn } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

/**
 * included_AR = 'Yes'
        AND included_AR = 'No' 
        AND
 */

@ViewEntity({
    expression: `
        SELECT * FROM qa_melia_data 
        WHERE  phase_name = 'AR'
        AND phase_year = '2020'
    `
})


export class QAMelia {

    @ViewColumn()
    id: number;
   
    @ViewColumn()
    crp_id: string;

    @ViewColumn()
    phase_name: string;
    
    @ViewColumn()
    phase_year: string;
    
    @ViewColumn()
    status: string;
    
    @ViewColumn()
    study_type: string;

    @ViewColumn()
    included_AR: string;
    
    @ViewColumn()
    title: string;
    
    @ViewColumn()
    description: string;
    
    @ViewColumn()
    melia_publications: string;

    @ViewColumn()
    editable_link: string;

    @ViewColumn()
    public_link: string;

}