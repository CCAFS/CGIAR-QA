import {MigrationInterface, QueryRunner} from "typeorm";

export class updateYearMetadata1613599680159 implements MigrationInterface {
    name = 'updateYearMetadata1613599680159'

    public async up(queryRunner: QueryRunner): Promise<any> {
        //UPDATE QA_PUBLICATIONS TO 2020
        await queryRunner.query("DELETE FROM `marlodb`.`typeorm_metadata` WHERE `type` = 'VIEW' AND `schema` = ? AND `name` = ?", ["marlodb","qa_publications"]);
        await queryRunner.query("DROP VIEW `qa_publications`", undefined);
        await queryRunner.query("CREATE VIEW `qa_publications` AS         SELECT * FROM qa_publications_data         WHERE phase_name = 'AR'        AND phase_year = '2020'    ", undefined);
        await queryRunner.query("INSERT INTO `marlodb`.`typeorm_metadata`(`type`, `schema`, `name`, `value`) VALUES (?, ?, ?, ?)", ["VIEW","marlodb","qa_publications","SELECT * FROM qa_publications_data \n        WHERE phase_name = 'AR'\n        AND phase_year = '2020'"]);
       
        // UPDATE QA_CAPDEV TO 2020
        await queryRunner.query("DELETE FROM `marlodb`.`typeorm_metadata` WHERE `type` = 'VIEW' AND `schema` = ? AND `name` = ?", ["marlodb","qa_capdev"]);
        await queryRunner.query("DROP VIEW `qa_capdev`", undefined);
        await queryRunner.query("CREATE VIEW `qa_capdev` AS         SELECT * FROM qa_capdev_view         WHERE phase_name = 'AR'        AND phase_year = '2020'    ", undefined);
        await queryRunner.query("INSERT INTO `marlodb`.`typeorm_metadata`(`type`, `schema`, `name`, `value`) VALUES (?, ?, ?, ?)", ["VIEW","marlodb","qa_capdev","SELECT * FROM qa_capdev_view \n        WHERE phase_name = 'AR'\n        AND phase_year = '2020'"]);
        
        

        await queryRunner.query("DELETE FROM `marlodb`.`typeorm_metadata` WHERE `type` = 'VIEW' AND `schema` = ? AND `name` = ?", ["marlodb","qa_outcomes"]);
        await queryRunner.query("DROP VIEW `qa_outcomes`", undefined);
        await queryRunner.query("DELETE FROM `marlodb`.`typeorm_metadata` WHERE `type` = 'VIEW' AND `schema` = ? AND `name` = ?", ["marlodb","qa_milestones"]);
        await queryRunner.query("DROP VIEW `qa_milestones`", undefined);
        await queryRunner.query("DELETE FROM `marlodb`.`typeorm_metadata` WHERE `type` = 'VIEW' AND `schema` = ? AND `name` = ?", ["marlodb","qa_innovations"]);
        await queryRunner.query("DROP VIEW `qa_innovations`", undefined);
        await queryRunner.query("DELETE FROM `marlodb`.`typeorm_metadata` WHERE `type` = 'VIEW' AND `schema` = ? AND `name` = ?", ["marlodb","qa_melia"]);
        await queryRunner.query("DROP VIEW `qa_melia`", undefined);
        await queryRunner.query("DELETE FROM `marlodb`.`typeorm_metadata` WHERE `type` = 'VIEW' AND `schema` = ? AND `name` = ?", ["marlodb","qa_oicr"]);
        await queryRunner.query("DROP VIEW `qa_oicr`", undefined);
        await queryRunner.query("DELETE FROM `marlodb`.`typeorm_metadata` WHERE `type` = 'VIEW' AND `schema` = ? AND `name` = ?", ["marlodb","qa_policies"]);
        await queryRunner.query("DROP VIEW `qa_policies`", undefined);

       
        await queryRunner.query("DELETE FROM `marlodb`.`typeorm_metadata` WHERE `type` = 'VIEW' AND `schema` = ? AND `name` = ?", ["marlodb","qa_slo"]);
        await queryRunner.query("DROP VIEW `qa_slo`", undefined);
        await queryRunner.query("CREATE VIEW `qa_innovations` AS         SELECT * FROM qa_innovations_data        WHERE  phase_name = 'AR'        AND phase_year = '2020'    ", undefined);        await queryRunner.query("INSERT INTO `marlodb`.`typeorm_metadata`(`type`, `schema`, `name`, `value`) VALUES (?, ?, ?, ?)", ["VIEW","marlodb","qa_innovations","SELECT * FROM qa_innovations_data\n        WHERE  phase_name = 'AR'\n        AND phase_year = '2020'"]);
        await queryRunner.query("CREATE VIEW `qa_melia` AS         SELECT * FROM qa_melia_data         WHERE  phase_name = 'AR'        AND phase_year = '2020'    ", undefined);
        await queryRunner.query("INSERT INTO `marlodb`.`typeorm_metadata`(`type`, `schema`, `name`, `value`) VALUES (?, ?, ?, ?)", ["VIEW","marlodb","qa_melia","SELECT * FROM qa_melia_data \n        WHERE  phase_name = 'AR'\n        AND phase_year = '2020'"]);
        await queryRunner.query("CREATE VIEW `qa_milestones` AS         SELECT * FROM qa_milestones_data        WHERE phase_name = 'AR'        AND phase_year = '2020'    ", undefined);
        await queryRunner.query("INSERT INTO `marlodb`.`typeorm_metadata`(`type`, `schema`, `name`, `value`) VALUES (?, ?, ?, ?)", ["VIEW","marlodb","qa_milestones","SELECT * FROM qa_milestones_data\n        WHERE phase_name = 'AR'\n        AND phase_year = '2020'"]);
        await queryRunner.query("CREATE VIEW `qa_oicr` AS         SELECT * FROM qa_oicr_data          WHERE  phase_name = 'AR'        AND phase_year = '2020'    ", undefined);
        await queryRunner.query("INSERT INTO `marlodb`.`typeorm_metadata`(`type`, `schema`, `name`, `value`) VALUES (?, ?, ?, ?)", ["VIEW","marlodb","qa_oicr","SELECT * FROM qa_oicr_data  \n        WHERE  phase_name = 'AR'\n        AND phase_year = '2020'"]);
        await queryRunner.query("CREATE VIEW `qa_outcomes` AS         SELECT * FROM qa_outcomes_view        WHERE phase_name = 'AR'        AND phase_year = '2020'    ", undefined);
        await queryRunner.query("INSERT INTO `marlodb`.`typeorm_metadata`(`type`, `schema`, `name`, `value`) VALUES (?, ?, ?, ?)", ["VIEW","marlodb","qa_outcomes","SELECT * FROM qa_outcomes_view\n        WHERE phase_name = 'AR'\n        AND phase_year = '2020'"]);
        await queryRunner.query("CREATE VIEW `qa_policies` AS         SELECT * FROM qa_policies_data        WHERE phase_name = 'AR'        AND phase_year = '2020'    ", undefined);
        await queryRunner.query("INSERT INTO `marlodb`.`typeorm_metadata`(`type`, `schema`, `name`, `value`) VALUES (?, ?, ?, ?)", ["VIEW","marlodb","qa_policies","SELECT * FROM qa_policies_data\n        WHERE phase_name = 'AR'\n        AND phase_year = '2020'"]);
        await queryRunner.query("CREATE VIEW `qa_slo` AS         SELECT * FROM qa_slo_targets_view          WHERE phase_name = 'AR'        AND phase_year = '2020'    ", undefined);
        await queryRunner.query("INSERT INTO `marlodb`.`typeorm_metadata`(`type`, `schema`, `name`, `value`) VALUES (?, ?, ?, ?)", ["VIEW","marlodb","qa_slo","SELECT * FROM qa_slo_targets_view  \n        WHERE phase_name = 'AR'\n        AND phase_year = '2020'"]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {

        // REVERT QA_PUBLICATIONS TO 2019
        await queryRunner.query("DELETE FROM `marlodb`.`typeorm_metadata` WHERE `type` = 'VIEW' AND `schema` = ? AND `name` = ?", ["marlodb","qa_publications"]);
        await queryRunner.query("DROP VIEW `qa_publications`", undefined);
        await queryRunner.query("CREATE VIEW `qa_publications` AS SELECT * FROM qa_publications_data         WHERE phase_name = 'AR'        AND phase_year = '2019'", undefined);
        await queryRunner.query("INSERT INTO `marlodb`.`typeorm_metadata`(`type`, `schema`, `name`, `value`) VALUES (?, ?, ?, ?)", ["VIEW","marlodb","qa_publications","SELECT * FROM qa_publications_data \n        WHERE phase_name = 'AR'\n        AND phase_year = '2019'"]);
        
        // // REVERT QA_CAPDEV TO 2019
        await queryRunner.query("DELETE FROM `marlodb`.`typeorm_metadata` WHERE `type` = 'VIEW' AND `schema` = ? AND `name` = ?", ["marlodb","qa_capdev"]);
        await queryRunner.query("DROP VIEW `qa_capdev`", undefined);
        await queryRunner.query("CREATE VIEW `qa_capdev` AS SELECT * FROM qa_capdev_view         WHERE phase_name = 'AR'        AND phase_year = '2019'", undefined);
        await queryRunner.query("INSERT INTO `marlodb`.`typeorm_metadata`(`type`, `schema`, `name`, `value`) VALUES (?, ?, ?, ?)", ["VIEW","marlodb","qa_capdev","SELECT * FROM qa_capdev_view \n        WHERE phase_name = 'AR'\n        AND phase_year = '2019'"]);
        
        await queryRunner.query("DELETE FROM `marlodb`.`typeorm_metadata` WHERE `type` = 'VIEW' AND `schema` = ? AND `name` = ?", ["marlodb","qa_slo"]);
        await queryRunner.query("DROP VIEW `qa_slo`", undefined);
        await queryRunner.query("DELETE FROM `marlodb`.`typeorm_metadata` WHERE `type` = 'VIEW' AND `schema` = ? AND `name` = ?", ["marlodb","qa_policies"]);
        await queryRunner.query("DROP VIEW `qa_policies`", undefined);
        await queryRunner.query("DELETE FROM `marlodb`.`typeorm_metadata` WHERE `type` = 'VIEW' AND `schema` = ? AND `name` = ?", ["marlodb","qa_outcomes"]);
        await queryRunner.query("DROP VIEW `qa_outcomes`", undefined);
        await queryRunner.query("DELETE FROM `marlodb`.`typeorm_metadata` WHERE `type` = 'VIEW' AND `schema` = ? AND `name` = ?", ["marlodb","qa_oicr"]);
        await queryRunner.query("DROP VIEW `qa_oicr`", undefined);
        await queryRunner.query("DELETE FROM `marlodb`.`typeorm_metadata` WHERE `type` = 'VIEW' AND `schema` = ? AND `name` = ?", ["marlodb","qa_milestones"]);
        await queryRunner.query("DROP VIEW `qa_milestones`", undefined);
        await queryRunner.query("DELETE FROM `marlodb`.`typeorm_metadata` WHERE `type` = 'VIEW' AND `schema` = ? AND `name` = ?", ["marlodb","qa_melia"]);
        await queryRunner.query("DROP VIEW `qa_melia`", undefined);
        await queryRunner.query("DELETE FROM `marlodb`.`typeorm_metadata` WHERE `type` = 'VIEW' AND `schema` = ? AND `name` = ?", ["marlodb","qa_innovations"]);
        await queryRunner.query("DROP VIEW `qa_innovations`", undefined);

        
        await queryRunner.query("CREATE VIEW `qa_slo` AS SELECT * FROM qa_slo_targets_view          WHERE phase_name = 'AR'        AND phase_year = '2019'", undefined);
        await queryRunner.query("INSERT INTO `marlodb`.`typeorm_metadata`(`type`, `schema`, `name`, `value`) VALUES (?, ?, ?, ?)", ["VIEW","marlodb","qa_slo","SELECT * FROM qa_slo_targets_view  \n        WHERE phase_name = 'AR'\n        AND phase_year = '2019'"]);
        await queryRunner.query("CREATE VIEW `qa_policies` AS SELECT * FROM qa_policies_data        WHERE phase_name = 'AR'        AND phase_year = '2019'", undefined);
        await queryRunner.query("INSERT INTO `marlodb`.`typeorm_metadata`(`type`, `schema`, `name`, `value`) VALUES (?, ?, ?, ?)", ["VIEW","marlodb","qa_policies","SELECT * FROM qa_policies_data\n        WHERE phase_name = 'AR'\n        AND phase_year = '2019'"]);
        await queryRunner.query("CREATE VIEW `qa_oicr` AS SELECT * FROM qa_oicr_data          WHERE  phase_name = 'AR'        AND phase_year = '2019'", undefined);
        await queryRunner.query("INSERT INTO `marlodb`.`typeorm_metadata`(`type`, `schema`, `name`, `value`) VALUES (?, ?, ?, ?)", ["VIEW","marlodb","qa_oicr","SELECT * FROM qa_oicr_data  \n        WHERE  phase_name = 'AR'\n        AND phase_year = '2019'"]);
        await queryRunner.query("CREATE VIEW `qa_melia` AS SELECT * FROM qa_melia_data         WHERE  phase_name = 'AR'        AND phase_year = '2019'", undefined);
        await queryRunner.query("INSERT INTO `marlodb`.`typeorm_metadata`(`type`, `schema`, `name`, `value`) VALUES (?, ?, ?, ?)", ["VIEW","marlodb","qa_melia","SELECT * FROM qa_melia_data \n        WHERE  phase_name = 'AR'\n        AND phase_year = '2019'"]);
        await queryRunner.query("CREATE VIEW `qa_innovations` AS SELECT * FROM qa_innovations_data        WHERE  phase_name = 'AR'        AND phase_year = '2019'", undefined);
        await queryRunner.query("INSERT INTO `marlodb`.`typeorm_metadata`(`type`, `schema`, `name`, `value`) VALUES (?, ?, ?, ?)", ["VIEW","marlodb","qa_innovations","SELECT * FROM qa_innovations_data\n        WHERE  phase_name = 'AR'\n        AND phase_year = '2019'"]);
        await queryRunner.query("CREATE VIEW `qa_milestones` AS SELECT * FROM qa_milestones_data        WHERE phase_name = 'AR'        AND phase_year = '2019'", undefined);
        await queryRunner.query("INSERT INTO `marlodb`.`typeorm_metadata`(`type`, `schema`, `name`, `value`) VALUES (?, ?, ?, ?)", ["VIEW","marlodb","qa_milestones","SELECT * FROM qa_milestones_data\n        WHERE phase_name = 'AR'\n        AND phase_year = '2019'"]);
        await queryRunner.query("CREATE VIEW `qa_outcomes` AS SELECT * FROM qa_outcomes_view        WHERE phase_name = 'AR'        AND phase_year = '2019'", undefined);
        await queryRunner.query("INSERT INTO `marlodb`.`typeorm_metadata`(`type`, `schema`, `name`, `value`) VALUES (?, ?, ?, ?)", ["VIEW","marlodb","qa_outcomes","SELECT * FROM qa_outcomes_view\n        WHERE phase_name = 'AR'\n        AND phase_year = '2019'"]);
    }

}
