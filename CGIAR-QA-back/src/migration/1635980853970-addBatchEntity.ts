import {MigrationInterface, QueryRunner} from "typeorm";

export class addBatchEntity1635980853970 implements MigrationInterface {
    name = 'addBatchEntity1635980853970'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `qa_batch` (`id` int NOT NULL AUTO_INCREMENT, `submission_date` datetime NOT NULL, `assessors_start_date` datetime NOT NULL, `assessors_end_date` datetime NOT NULL, `programs_start_date` datetime NOT NULL, `programs_end_date` datetime NOT NULL, `batch_name` varchar(255) NULL, `phase_year` decimal(10,0) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `qa_batch`", undefined);
    }

}
