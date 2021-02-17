import { ViewEntity, ViewColumn } from "typeorm";


@ViewEntity({
    expression: `
        SELECT * FROM qa_capdev_view 
        WHERE phase_name = 'AR'
        AND phase_year = '2020'
    `
})


export class QACapdev {

    @ViewColumn()
    crp_id: string;

    @ViewColumn()
    id: number;
   
    @ViewColumn()
    phase_name: string;
    
    @ViewColumn()
    phase_year: string;

    @ViewColumn()
    trainees_long_term_female: string;
    
    @ViewColumn()
    trainees_long_term_male: string;

    @ViewColumn()
    trainees_phd_female: string;
    
    @ViewColumn()
    trainees_phd_male: string;

    @ViewColumn()
    trainees_short_term_female: string;

    @ViewColumn()
    trainees_short_term_male: string;


}