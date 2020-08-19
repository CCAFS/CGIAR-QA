import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { QAUsers } from "../entity/User";
import { QARoles } from "../entity/Roles";
import { RolesHandler } from "../_helpers/RolesHandler";

export class CreateAdminUser1580324189443 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const userRepository = getRepository(QAUsers);
        // const indicatorbyUsrRepository = getRepository(QAIndicatorUser);
        const roleRepository = getRepository(QARoles);
        let user = new QAUsers();
        user.username = "felipe-admin";
        user.password = "12345678";
        user.name = "Felipe";
        user.email = "felipe.super@cgiar.org";
        user.hashPassword();

        let role = await roleRepository.find({
            select: ["id"],
            where: { description: RolesHandler.admin }
        });
        user.roles = role;
        
        user = await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<any> { }

}
