import { MigrationInterface, QueryRunner, getRepository } from "typeorm";

import { QAIndicators } from "../entity/Indicators";
import { QACommentsMeta } from "../entity/CommentsMeta";

export class CreateCommentsMeta1585244201947 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const indicatorRepository = getRepository(QAIndicators);
        const commentsMetaRepository = getRepository(QACommentsMeta);

        const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
            `SELECT
                *
            FROM
                qa_indicators
            WHERE
                qa_indicators.id NOT IN (SELECT indicatorId FROM qa_comments_meta )`,
            {},
            {}
        );

        let indicators = await queryRunner.query(query, parameters);
        // let indicators = await indicatorRepository.find();
        // let indicatorsId = indicators.map(indicator => { return indicator.id });
        // let savePromises = [];


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
