export class CRP {
    id: number;
    name: string;
    crp_id: string;
    acronym: string;
    is_marlo: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(id, name, crp_id, acronym, is_marlo) {
        this.id = id;
        this.name = name;
        this.crp_id = crp_id;
        this.acronym = acronym;
        this.is_marlo = is_marlo;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}