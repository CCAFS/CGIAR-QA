import {MigrationInterface, QueryRunner} from "typeorm";

export class addRequireSecondAssessmentToEvals1633987142841 implements MigrationInterface {
    name = 'addRequireSecondAssessmentToEvals1633987142841'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `qa_evaluations` ADD `require_second_assessment` tinyint NOT NULL DEFAULT 0", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `qa_evaluations` DROP COLUMN `require_second_assessment`", undefined);
    }

}
