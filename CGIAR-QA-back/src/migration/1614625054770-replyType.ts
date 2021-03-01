import {MigrationInterface, QueryRunner} from "typeorm";

export class replyType1614625054770 implements MigrationInterface {
    name = 'replyType1614625054770'

    public async up(queryRunner: QueryRunner): Promise<any> {

        await queryRunner.query("CREATE TABLE `qa_reply_type` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `qa_comments` ADD `replyTypeId` int NULL", undefined);
        await queryRunner.query("ALTER TABLE `qa_comments` ADD CONSTRAINT `FK_50bbfaee028e6bad303b536c5d4` FOREIGN KEY (`replyTypeId`) REFERENCES `qa_reply_type`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `qa_comments` DROP FOREIGN KEY `FK_50bbfaee028e6bad303b536c5d4`", undefined);
        await queryRunner.query("ALTER TABLE `qa_comments` DROP COLUMN `replyTypeId`", undefined);
        await queryRunner.query("DROP TABLE `qa_reply_type`", undefined);
    }

}
