import { MigrationInterface, QueryRunner, getConnection, getRepository } from "typeorm";

import { QAIndicatorsMeta } from "../entity/IndicatorsMeta";
import { QAIndicators } from "../entity/Indicators";

export class CreateMetaForPolicies1582313672182 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {

        let pols_meta = getConnection().getMetadata('qa_policies').ownColumns.map(column => column.propertyName);
        let primary = "policy_id";

        const indicatorRepository = getRepository(QAIndicators);
        const indicatorMetaRepository = getRepository(QAIndicatorsMeta);

        let indicator_ = await indicatorRepository.findOneOrFail(1);
        let savePromises = [];
        for (let index = 0; index < pols_meta.length; index++) {
            const element = pols_meta[index];

            const indicator_meta = new QAIndicatorsMeta();
            indicator_meta.col_name = element;
            indicator_meta.display_name = element.split("_").join(" ");
            indicator_meta.enable_comments = true;
            indicator_meta.include_detail = true;
            indicator_meta.include_general = true;
            indicator_meta.indicator = indicator_;

            indicator_meta.is_primay = (element == 'policy_id') ? true : false;
            savePromises.push(indicator_meta);

        }

        let response = await indicatorMetaRepository.save(savePromises);

        console.log(response)

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
