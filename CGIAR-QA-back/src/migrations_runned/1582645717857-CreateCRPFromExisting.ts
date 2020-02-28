import { MigrationInterface, QueryRunner, getRepository } from "typeorm";

import { QACrp } from "../entity/CRP";

export class CreateCRPFromExisting1582645717857 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        const crpRepository = getRepository(QACrp);

        const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
            'SELECT * from `global_units` where global_unit_type_id in (3,1) ',
            {},
            {}
        );

        const locationsRawResult = await queryRunner.query(query, parameters);
        let savePromises = [];

        for (let index = 0; index < locationsRawResult.length; index++) {
            const element = locationsRawResult[index];
            // console.log('=>',element);
            const crp = new QACrp();
            crp.acronym = element.acronym;
            crp.is_marlo = (element.is_marlo == 0) ? false : true;
            crp.crp_id = element.smo_code;
            crp.name = element.name;
            savePromises.push(crp);
        }

        let response = await crpRepository.save(savePromises);

        console.log(response.length, locationsRawResult.length)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
