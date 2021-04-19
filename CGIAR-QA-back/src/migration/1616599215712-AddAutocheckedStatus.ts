import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAutocheckedStatus1616599215712 implements MigrationInterface {
    name = 'AddAutocheckedStatus1616599215712'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `qa_evaluations` CHANGE `status` `status` enum ('complete', 'pending', 'finalized', 'autochecked') NOT NULL DEFAULT 'pending'", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `qa_evaluations` CHANGE `status` `status` enum ('complete', 'pending', 'finalized') NOT NULL DEFAULT 'pending'", undefined);
    }

}
