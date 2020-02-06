import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { QAUsers } from "../entity/User";
import { QARoles } from "../entity/Roles";

export class CreateAdminUser1580324189443 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        let user = new QAUsers();
        user.username = "felipe";
        user.password = "12345678";
        user.name = "Felipe";
        user.email = "f.elvira@cgiar.org";
        user.indicators = [];
        user.hashPassword();
        const roleRepository = getRepository(QARoles);
        let role = await roleRepository.find({
            select: ["id"]
        });
        user.roles = role;
        const userRepository = getRepository(QAUsers);
        await userRepository.save(user);
    }

    public async down(queryRunner: QueryRunner): Promise<any> { }

}
