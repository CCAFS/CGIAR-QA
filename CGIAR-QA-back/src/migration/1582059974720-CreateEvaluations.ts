import { MigrationInterface, QueryRunner, getRepository, createQueryBuilder } from "typeorm";
import { QAIndicatorUser } from "../entity/IndicatorByUser";
import { QAEvaluations } from "../entity/Evaluations";
import { QAPolicies } from "../entity/PoliciesView";
import { StatusHandler } from "../_helpers/StatusHandler"
import { QAIndicators } from "../entity/Indicators";

export class CreateEvaluations1582059974720 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const indicatorRepository = getRepository(QAIndicators);
        const evaluationsRepository = getRepository(QAEvaluations);
        let primary_field = 'id' //NOT CHANGE
        let view_name = 'qa_policies' //CHANGE
        let indicatorId = 2 //CHANGE
        let userId = 2

        let indicator_ = await indicatorRepository.find({
            where: { id: indicatorId },
        });

        let view_data = await createQueryBuilder(view_name)
            .getMany();
        let savePromises = [];
        // console.log(indicator_, view_data.length)
        for (let index = 0; index < view_data.length; index++) {
            let element = view_data[index];

            const evaluation = new QAEvaluations();
            evaluation.indicator_view_id = element[primary_field];
            evaluation.crp_id = element['crp_id'];
            evaluation.indicator = indicator_;
            evaluation.indicator_view_name = view_name;
            evaluation.status = StatusHandler.Pending;

            savePromises.push(evaluation);

        }
        // console.log(savePromises.length)

        let a = await evaluationsRepository.save(savePromises);
        console.log(a.length)

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
