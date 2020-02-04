import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";

import { QAUsers } from "../entity/User";
const { ErrorHandler } = require("../_helpers/ErrorHandler")

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        //Get the user ID from previous midleware
        const id = res.locals.jwtPayload.userId;
        //Get user role from the database
        const userRepository = getRepository(QAUsers);
        let user: QAUsers;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            console.error(error)
            throw new ErrorHandler(401, 'User unauthorized.');
        }

        //Check if array of authorized roles includes the user's role
        if (roles.indexOf(user.role) > -1) next();
        else throw new ErrorHandler(401, 'User unauthorized.');
    };
};