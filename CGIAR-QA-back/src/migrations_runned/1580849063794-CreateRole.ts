import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { QARoles } from "../entity/Roles";
import { QAPermissions } from "../entity/Permissions";
import { RolesHandler } from "../_helpers/RolesHandler";

export class CreateRole1580849063794 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let role = new QARoles();
        role.acronym = 'ADM';
        role.description = RolesHandler.admin;
        role.is_active = true;

        const permissionsRepository = getRepository(QAPermissions);
        let permissions = await permissionsRepository.find({
            select: ["id"]
        });
        role.permissions = permissions;
        
        const roleRepository = getRepository(QARoles);
        await roleRepository.save(role);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
