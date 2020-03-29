import { MigrationInterface, QueryRunner, getRepository } from "typeorm";

import { QAIndicators } from "../entity/Indicators";
import { QACommentsMeta } from "../entity/CommentsMeta";

export class CreateCommentsMeta1585244201947 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const indicatorRepository = getRepository(QAIndicators);
        const commentsMetaRepository = getRepository(QACommentsMeta);

        let indicators = await indicatorRepository.find();
        // let indicatorsId = indicators.map(indicator => { return indicator.id });

        try {
            let savePromises = [];
            for (let index = 0; index < indicators.length; index++) {
                const element = indicators[index];
                let newCommentMeta = new QACommentsMeta();

                newCommentMeta.enable_assessor = false;
                newCommentMeta.enable_crp = false;
                newCommentMeta.indicator = element;
                savePromises.push(newCommentMeta);

            }

            let response = await commentsMetaRepository.save(savePromises);

            console.log(response.length)
        } catch (error) {
            console.log(error)
        }



    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
