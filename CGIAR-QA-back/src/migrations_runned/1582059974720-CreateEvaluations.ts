import { MigrationInterface, QueryRunner, getRepository, createQueryBuilder } from "typeorm";
import { QAIndicatorUser } from "../entity/IndicatorByUser";
import { QAEvaluations } from "../entity/Evaluations";
import { QAPolicies } from "../entity/PoliciesView";
import { StatusHandler } from "../_helpers/StatusHandler"

export class CreateEvaluations1582059974720 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const indicatorUsrRepository = getRepository(QAIndicatorUser);
        const evaluationsRepository = getRepository(QAEvaluations);
        let primary_field = 'project_innovation_id' //CHANGE
        let view_name = 'qa_innovations' //CHANGE
        let indicatorId = 2 //CHANGE
        let userId = 2

        let indByUsr = await indicatorUsrRepository.find({
            where: { userId: userId, indicator: indicatorId },
        });


        let view_data = await createQueryBuilder(view_name)
            .getMany();
        let savePromises = [];
        for (let index = 0; index < view_data.length; index++) {
            let element = view_data[index];

            const evaluations = new QAEvaluations();
            evaluations.indicator_view_id = element[primary_field];
            evaluations.crp_id = element['crp_id'];
            evaluations.indicator_view_name = view_name;
            evaluations.indicator_user = indByUsr[0];
            evaluations.status = StatusHandler.Pending;

            savePromises.push(evaluations);

        }
        console.log(savePromises.length)
        
        let a = await evaluationsRepository.save(savePromises);
        console.log(a.length)

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}