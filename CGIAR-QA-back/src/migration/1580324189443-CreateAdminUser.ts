import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { QAUser } from "../entity/User";
import { RolesHandler } from "../_helpers/RolesHandler"

export class CreateAdminUser1580324189443 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let user = new QAUser();
        user.username = "felipe";
        user.password = "12345678";
        user.name = "Felipe";
        user.email = "f.elvira@cgiar.org";
        user.indicators = [];
        user.hashPassword();
        user.role = RolesHandler.admin;
        const userRepository = getRepository(QAUser);
        await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<any> { }

}
