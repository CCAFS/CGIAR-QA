import {MigrationInterface, QueryRunner} from "typeorm";

export class addOriginalFieldComment1631223111053 implements MigrationInterface {
    name = 'addOriginalFieldComment1631223111053'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `qa_comments` ADD `original_field` longtext NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `qa_comments` DROP COLUMN `original_field`", undefined);
    }

}
