import {MigrationInterface, QueryRunner} from "typeorm";

export class addQuickComments1635340500958 implements MigrationInterface {
    name = 'addQuickComments1635340500958'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("CREATE TABLE `qa_quick_comments` (`id` int NOT NULL AUTO_INCREMENT, `comment` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("DROP TABLE `qa_quick_comments`", undefined);
    }

}
