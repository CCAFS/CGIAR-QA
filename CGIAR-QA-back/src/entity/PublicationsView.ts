import { ViewEntity, ViewColumn } from "typeorm";

/**
 * included_AR = 'Yes'
        AND included_AR = 'No' 
        AND 
 */

@ViewEntity({
    expression: `
        SELECT * FROM qa_publications_data 
        WHERE phase_name = 'AR'
        AND phase_year = '2021'
    `
})


export class QAPublications {

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
    authors: string;

    @ViewColumn()
    publication_date: string;

    @ViewColumn()
    journal: string;

    @ViewColumn()
    volume: string;

    @ViewColumn()
    issue: string;

    @ViewColumn()
    pages: string;

    @ViewColumn()
    is_OA: number;

    @ViewColumn()
    is_ISI: number;

    @ViewColumn()
    DOI: string;

    @ViewColumn()
    Handle: string;
    
    @ViewColumn()
    shared_publications: string;

    @ViewColumn()
    editable_link: string;

    @ViewColumn()
    public_link: string;

    @ViewColumn()
    isWOS: string;


}
