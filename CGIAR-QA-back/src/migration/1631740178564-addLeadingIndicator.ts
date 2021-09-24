import {MigrationInterface, QueryRunner} from "typeorm";

export class addLeadingIndicator1631740178564 implements MigrationInterface {
    name = 'addLeadingIndicator1631740178564'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `qa_indicator_user` ADD `isLeader` tinyint NOT NULL DEFAULT 0", undefined);
        await queryRunner.query("ALTER TABLE `qa_evaluations` CHANGE `batchDate` `batchDate` datetime NOT NULL DEFAULT NOW()", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `qa_evaluations` CHANGE `batchDate` `batchDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP", undefined);
        await queryRunner.query("ALTER TABLE `qa_indicator_user` DROP COLUMN `isLeader`", undefined);
    }

}
