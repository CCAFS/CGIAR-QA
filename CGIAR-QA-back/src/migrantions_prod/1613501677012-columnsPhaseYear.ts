import {MigrationInterface, QueryRunner} from "typeorm";

export class columnsPhaseYear1613501677012 implements MigrationInterface {
    name = 'columnsPhaseYear1613501677012'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `qa_evaluations` ADD `phase_year` decimal(10,0) NOT NULL", undefined);
        await queryRunner.query("ALTER TABLE `qa_cycle` ADD `phase_year` decimal(10,0) NOT NULL", undefined);
        await queryRunner.query("UPDATE qa_evaluations SET phase_year = 2019 WHERE phase_year = 0", undefined);
        
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `qa_cycle` DROP COLUMN `phase_year`", undefined);
        await queryRunner.query("ALTER TABLE `qa_evaluations` DROP COLUMN `phase_year`", undefined);

        
    }

}
