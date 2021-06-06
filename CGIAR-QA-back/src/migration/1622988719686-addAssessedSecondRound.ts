import { MigrationInterface, QueryRunner } from "typeorm";

export class addAssessedSecondRound1622988719686 implements MigrationInterface {
    name = 'addAssessedSecondRound1622988719686'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `qa_evaluations_assessed_by_second_round_qa_users` (`qaEvaluationsId` int NOT NULL, `qaUsersId` int NOT NULL, INDEX `IDX_93b32902926dd66dca0f677c4d` (`qaEvaluationsId`), INDEX `IDX_bc4ec2896c038178af9e38eb7b` (`qaUsersId`), PRIMARY KEY (`qaEvaluationsId`, `qaUsersId`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `qa_evaluations_assessed_by_second_round_qa_users` ADD CONSTRAINT `FK_93b32902926dd66dca0f677c4d9` FOREIGN KEY (`qaEvaluationsId`) REFERENCES `qa_evaluations`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `qa_evaluations_assessed_by_second_round_qa_users` ADD CONSTRAINT `FK_bc4ec2896c038178af9e38eb7b9` FOREIGN KEY (`qaUsersId`) REFERENCES `qa_users`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `qa_evaluations_assessed_by_second_round_qa_users` DROP FOREIGN KEY `FK_bc4ec2896c038178af9e38eb7b9`", undefined);
        await queryRunner.query("ALTER TABLE `qa_evaluations_assessed_by_second_round_qa_users` DROP FOREIGN KEY `FK_93b32902926dd66dca0f677c4d9`", undefined);
        await queryRunner.query("DROP INDEX `IDX_bc4ec2896c038178af9e38eb7b` ON `qa_evaluations_assessed_by_second_round_qa_users`", undefined);
        await queryRunner.query("DROP INDEX `IDX_93b32902926dd66dca0f677c4d` ON `qa_evaluations_assessed_by_second_round_qa_users`", undefined);
        await queryRunner.query("DROP TABLE `qa_evaluations_assessed_by_second_round_qa_users`", undefined);
    }

}
