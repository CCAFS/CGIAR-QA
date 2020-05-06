import { MigrationInterface, QueryRunner, getRepository, createQueryBuilder } from "typeorm";

import { QAIndicatorUser } from "../entity/IndicatorByUser";
import { QAEvaluations } from "../entity/Evaluations";

export class UpdateEvaluationsWithCRP1582659577926 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let evaluations = await getRepository(QAEvaluations).find({ relations: ['indicator_user'] });
        let savePromises = [];

        for (let index = 0; index < evaluations.length; index++) {
            const element = evaluations[index];
            const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                `SELECT crp_id FROM ${element['indicator_user'].indicator.view_name} WHERE ${element['indicator_user'].indicator.primary_field} = :view_id`,
                { view_id: element.indicator_view_id },
                {}
            );
            const view_data = await queryRunner.query(query, parameters);
            let response = await getRepository(QAEvaluations).update(element.id, { crp_id: view_data[0].crp_id });
            savePromises.push(response);
        }
        console.log(savePromises.length);


    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
