export class User {
    id: number;
    username: string;
    email: string;
    password: string;
    roles:any[];
    config:any[];
    cycle:any;
    indicators:any[];
    crp:any;
    name: string;
    cycle_ended:any;
    token: string;

    // constructor(id, name, crp_id, acronym, is_marlo) {
    //     this.id = id;
    //     this.name = name;
    //     this.crp_id = crp_id;
    //     this.acronym = acronym;
    //     this.is_marlo = is_marlo;
    //     this.createdAt = new Date();
    //     this.updatedAt = new Date();
    // }
}