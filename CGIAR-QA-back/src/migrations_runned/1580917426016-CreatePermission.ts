import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { QAPermissions } from "../entity/Permissions";

export class CreatePermission1580917426016 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let permissions = new QAPermissions();
        permissions.description = 'WILDCARD Full privileges on all the platform';
        permissions.permission = '*';
        const permissionRepository = getRepository(QAPermissions);
        await permissionRepository.save(permissions);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
