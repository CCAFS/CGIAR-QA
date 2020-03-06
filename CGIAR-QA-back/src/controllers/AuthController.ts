import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository, In } from "typeorm";
import { validate } from "class-validator";

import config from "@config/config";

import { QAUsers } from "@entity/User";
import { QAGeneralConfiguration } from "@entity/GeneralConfig";

const { ErrorHandler } = require("@helpers/ErrorHandler")

class AuthController {
    static login = async (req: Request, res: Response, next: NextFunction) => {

        try {
            //Check if username and password are set
            let { username, password } = req.body;
            if (!(username && password)) {
                throw new ErrorHandler(404, 'Missing required email and password fields.')
            }

            //Get user from database
            const userRepository = getRepository(QAUsers);
            const grnlConfg = getRepository(QAGeneralConfiguration);
            let user: QAUsers;

            user = await userRepository.findOneOrFail({ where: { username } });

            // get general config by user role
            let generalConfig = await grnlConfg
                .createQueryBuilder("qa_general_config")
                .select('*')
                .where(`roleId IN (${user.roles.map(role => { return role.id })})`)
                .andWhere("DATE(qa_general_config.start_date) <= CURDATE()")
                .andWhere("DATE(qa_general_config.end_date) > CURDATE()")
                .getRawMany();
            //Check if encrypted password match
            if (!user.checkIfUnencryptedPasswordIsValid(password)) {
                throw new ErrorHandler(401, 'Password does not match.');
            }

            //Sing JWT, valid for ``config.jwtTime`` 
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                config.jwtSecret,
                { expiresIn: config.jwtTime }
            );


            user["token"] = token;
            user["config"] = generalConfig;
            delete user.password;
            //Send the jwt in the response
            res.status(200).json({ data: user })

        } catch (error) {
            next(error)
        }

    };

    static changePassword = async (req: Request, res: Response) => {
        //Get ID from JWT
        const id = res.locals.jwtPayload.userId;

        //Get parameters from the body
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) {
            throw new ErrorHandler(400, 'Passwords are not the same.');
        }

        //Get user from the database
        const userRepository = getRepository(QAUsers);
        let user: QAUsers;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (id) {
            throw new ErrorHandler(401, 'User not found.');
        }

        //Check if old password matchs
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            throw new ErrorHandler(401, 'Password does not match.');
        }

        //Validate de model (password lenght)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
            throw new ErrorHandler(400, errors);
        }
        //Hash the new password and save
        user.hashPassword();
        userRepository.save(user);
        delete user.password;

        res.status(204).send({ data: user });
    };

    static createGeneralConfig = async (req: Request, res: Response) => {
        //get body data
        console.log(req.body)
        let { end_date, start_date, role, status } = req.body;
        try {
            const configRepository = getRepository(QAGeneralConfiguration);
            let config = new QAGeneralConfiguration();
            config.end_date = end_date;
            config.start_date = start_date;
            config.status = status;
            config.role = role;


            config = await configRepository.save(config);

            res.status(200).send({ data: config });

        } catch (error) {
            console.log(error)
            res.status(400).send({ data: error, message: 'Configuration can not be created' });
        }
    }


}
export default AuthController;