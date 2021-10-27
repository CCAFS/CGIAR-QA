import {MigrationInterface, QueryRunner} from "typeorm";

export class addAssessedByColumn2Evaluations1617808381246 implements MigrationInterface {
    name = 'addAssessedByColumn2Evaluations1617808381246'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `qa_evaluations_assessed_by_qa_users` (`qaEvaluationsId` int NOT NULL, `qaUsersId` int NOT NULL, INDEX `IDX_4f5bff2724f7cff8a07b2ce4f5` (`qaEvaluationsId`), INDEX `IDX_97eef3f1d30dcc944b381875a7` (`qaUsersId`), PRIMARY KEY (`qaEvaluationsId`, `qaUsersId`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `qa_evaluations_assessed_by_qa_users` ADD CONSTRAINT `FK_4f5bff2724f7cff8a07b2ce4f54` FOREIGN KEY (`qaEvaluationsId`) REFERENCES `qa_evaluations`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `qa_evaluations_assessed_by_qa_users` ADD CONSTRAINT `FK_97eef3f1d30dcc944b381875a79` FOREIGN KEY (`qaUsersId`) REFERENCES `qa_users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `qa_evaluations_assessed_by_qa_users` DROP FOREIGN KEY `FK_97eef3f1d30dcc944b381875a79`", undefined);
        await queryRunner.query("ALTER TABLE `qa_evaluations_assessed_by_qa_users` DROP FOREIGN KEY `FK_4f5bff2724f7cff8a07b2ce4f54`", undefined);
        await queryRunner.query("DROP INDEX `IDX_97eef3f1d30dcc944b381875a7` ON `qa_evaluations_assessed_by_qa_users`", undefined);
        await queryRunner.query("DROP INDEX `IDX_4f5bff2724f7cff8a07b2ce4f5` ON `qa_evaluations_assessed_by_qa_users`", undefined);
        await queryRunner.query("DROP TABLE `qa_evaluations_assessed_by_qa_users`", undefined);
    }

}
