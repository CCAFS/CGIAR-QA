import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { QAUser } from "../entity/User";
import config from "../config/config";
const { ErrorHandler } = require("../_helpers/ErrorHandler")

class AuthController {
    static login = async (req: Request, res: Response, next: NextFunction) => {

        try {
            //Check if username and password are set
            let { username, password } = req.body;
            if (!(username && password)) {
                throw new ErrorHandler(404, 'Missing required email and password fields.')
            }

            //Get user from database
            const userRepository = getRepository(QAUser);
            let user: QAUser;
            try {
                user = await userRepository.findOneOrFail({ where: { username } });
            } catch (error) {
                throw new ErrorHandler(401, 'User not found.');
            }

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
        const userRepository = getRepository(QAUser);
        let user: QAUser;
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
}
export default AuthController;