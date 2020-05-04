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
        let view_name = 'qa_milestones';//CHANGE
        // let indicatorId = 1 //CHANGE
        // let userId = 2

        let existing_eval = await evaluationsRepository.find({
            where : {
                indicator_view_name: view_name
            }
        })

        if (existing_eval.length > 0) {
            console.error(existing_eval.length)
            throw new Error('indicator evaluations already created')
        }

        let view_data = await createQueryBuilder(view_name)
            .getMany();
        let savePromises = [];
        // console.log(indicator_, view_data.length)
        for (let index = 0; index < view_data.length; index++) {
            let element = view_data[index];

            const evaluation = new QAEvaluations();
            evaluation.indicator_view_id = element[primary_field];
            evaluation.crp_id = element['crp_id'];
            evaluation.indicator_view_name = view_name;
            evaluation.status = StatusHandler.Pending;
            // evaluation.indicator = indicator_;

            savePromises.push(evaluation);

        }
        let a = await evaluationsRepository.save(savePromises);
        console.log(a.length)

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
