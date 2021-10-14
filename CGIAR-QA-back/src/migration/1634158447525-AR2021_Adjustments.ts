import {MigrationInterface, QueryRunner} from "typeorm";

export class AR2021Adjustments1634158447525 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        //SLO
        await queryRunner.query("UPDATE `marlodb`.`qa_indicators_meta` SET `include_detail` = '0', `order` = '0' WHERE (`id` = '151')");

        //Policies
        await queryRunner.query("UPDATE `marlodb`.`qa_indicators_meta` SET `display_name` = 'Stage in process' WHERE (`id` = '35)");
        
        //OICRs
        await queryRunner.query("UPDATE `marlodb`.`qa_indicators_meta` SET `include_detail` = '0', `order` = '0' WHERE (`id` = '77');");

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
