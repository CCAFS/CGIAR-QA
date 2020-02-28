import { MigrationInterface, QueryRunner, getRepository, createQueryBuilder } from "typeorm";
import { QAIndicatorUser } from "../entity/IndicatorByUser";
import { QAEvaluations } from "../entity/Evaluations";
import { QAPolicies } from "../entity/PoliciesView";
import { StatusHandler } from "../_helpers/StatusHandler"

export class CreatePoliciesEvaluations1582059974720 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const indicatorUsrRepository = getRepository(QAIndicatorUser);
        const evaluationsRepository = getRepository(QAEvaluations);

        let indByUsr = await indicatorUsrRepository.find({
            where: { userId: 3 },
        });


        let view_data = await createQueryBuilder(indByUsr[0].indicator.view_name)
            .getMany();
        let savePromises = [];
        for (let index = 0; index < view_data.length; index++) {
            let element= view_data[index];
            
            const evaluations = new QAEvaluations();
            evaluations.indicator_view_id = element['policy_id'] ;
            evaluations.indicator_view_name = indByUsr[0].indicator.view_name;
            evaluations.indicator_user = indByUsr[0];
            evaluations.status = StatusHandler.Pending;

            savePromises.push(evaluations);

        }

        let a = await evaluationsRepository.save(savePromises);


    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
