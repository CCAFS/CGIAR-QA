import {MigrationInterface, QueryRunner} from "typeorm";

export class addAssessorsGuidanceColumn2GC1619454213979 implements MigrationInterface {
    name = 'addAssessorsGuidanceColumn2GC1619454213979'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `qa_general_configuration` ADD `assessors_guideline` varchar(255) NOT NULL DEFAULT ''", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `qa_general_configuration` DROP COLUMN `assessors_guideline`", undefined);
    }

}
