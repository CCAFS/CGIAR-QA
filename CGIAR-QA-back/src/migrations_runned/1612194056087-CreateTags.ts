import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateTags1612194056087 implements MigrationInterface {
    name = 'CreateTags1612194056087'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `qa_tag_type` (`id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("CREATE TABLE `qa_tags` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `userId` int NULL, `tagTypeId` int NULL, `commentId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
        await queryRunner.query("ALTER TABLE `qa_tags` ADD CONSTRAINT `FK_b8c8bfcf2e09544d352b73e9083` FOREIGN KEY (`userId`) REFERENCES `qa_users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `qa_tags` ADD CONSTRAINT `FK_238b0576407c0cdb2bae04c4d7c` FOREIGN KEY (`tagTypeId`) REFERENCES `qa_tag_type`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
        await queryRunner.query("ALTER TABLE `qa_tags` ADD CONSTRAINT `FK_e335cca998efc5e5261243ebbc7` FOREIGN KEY (`commentId`) REFERENCES `qa_comments`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `qa_tags` DROP FOREIGN KEY `FK_e335cca998efc5e5261243ebbc7`", undefined);
        await queryRunner.query("ALTER TABLE `qa_tags` DROP FOREIGN KEY `FK_238b0576407c0cdb2bae04c4d7c`", undefined);
        await queryRunner.query("ALTER TABLE `qa_tags` DROP FOREIGN KEY `FK_b8c8bfcf2e09544d352b73e9083`", undefined);
        await queryRunner.query("DROP TABLE `qa_tags`", undefined);
        await queryRunner.query("DROP TABLE `qa_tag_type`", undefined);
    }

}
