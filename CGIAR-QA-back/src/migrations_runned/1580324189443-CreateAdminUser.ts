import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { QAUsers } from "../entity/User";
import { QARoles } from "../entity/Roles";
import { QAIndicatorUser } from "../entity/IndicatorByUser";
import { QAIndicators } from "../entity/Indicators";
import { View } from "typeorm/schema-builder/view/View";

export class CreateAdminUser1580324189443 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const userRepository = getRepository(QAUsers);
        const indicatorbyUsrRepository = getRepository(QAIndicatorUser);
        let user = new QAUsers();
        user.username = "felipe-admin";
        user.password = "12345678";
        user.name = "Felipe";
        user.email = "felipe.admin@cgiar.org";
        user.hashPassword();
        const roleRepository = getRepository(QARoles);
        user = await userRepository.save(user);
        // let role = await roleRepository.find({
        //     select: ["id"]
        // });
        // user.roles = role;

        // const indicatorRepository = getRepository(QAIndicators);
        // let indicator = await indicatorRepository.find({
        //     select: ["id"]
        // });

        
        // let indiByUsr = new QAIndicatorUser();
        // indiByUsr.indicator = indicator[0];
        // indiByUsr.user = user;
        // await indicatorbyUsrRepository.save(indiByUsr);

    }

    public async down(queryRunner: QueryRunner): Promise<any> { }

}
