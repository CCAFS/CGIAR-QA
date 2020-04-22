import { ViewEntity, ViewColumn } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";


@ViewEntity({
    expression: `
        SELECT * FROM qa_melia_view 
        WHERE included_AR = 'Yes' 
        AND phase_name = 'AR'
        AND phase_year = '2019'
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