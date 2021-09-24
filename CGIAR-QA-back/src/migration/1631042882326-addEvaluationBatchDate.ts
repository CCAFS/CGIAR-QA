import {MigrationInterface, QueryRunner} from "typeorm";

export class addEvaluationBatchDate1631042882326 implements MigrationInterface {
    name = 'addEvaluationBatchDate1631042882326'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `qa_evaluations` ADD `batchDate` datetime NOT NULL DEFAULT NOW()", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `qa_evaluations` DROP COLUMN `batchDate`", undefined);
    }

}
