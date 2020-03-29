import { MigrationInterface, QueryRunner, getConnection, getRepository } from "typeorm";

import { QAIndicatorsMeta } from "../entity/IndicatorsMeta";
import { QAIndicators } from "../entity/Indicators";

export class CreateMetaForPolicies1582313672182 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let view_name = 'qa_innovations'
        let primary_field = "project_innovation_id";
        let view_indicator_id = 2;

        
        let pols_meta = getConnection().getMetadata(view_name).ownColumns.map(column => column.propertyName);

        const indicatorRepository = getRepository(QAIndicators);
        const indicatorMetaRepository = getRepository(QAIndicatorsMeta);

        let indicator_ = await indicatorRepository.findOneOrFail(view_indicator_id);
        let savePromises = [];
        console.log(pols_meta)
        for (let index = 0; index < pols_meta.length; index++) {
            const element = pols_meta[index];

            const indicator_meta = new QAIndicatorsMeta();
            indicator_meta.col_name = element;
            indicator_meta.display_name = element.split("_").join(" ");
            indicator_meta.enable_comments = true;
            indicator_meta.include_detail = true;
            indicator_meta.include_general = true;
            indicator_meta.indicator = indicator_;

            indicator_meta.is_primay = (element == primary_field) ? true : false;
            savePromises.push(indicator_meta);

        }

        let response = await indicatorMetaRepository.save(savePromises);

       console.log(response.length)

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
