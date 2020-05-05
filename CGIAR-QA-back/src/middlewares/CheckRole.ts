import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";

import { QAUsers } from "@entity/User";
import { QARoles } from "@entity/Roles";
const { ErrorHandler } = require("@helpers/ErrorHandler")

export const checkRole = (roles: Array<string>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        //Get the user ID from previous midleware
        const id = res.locals.jwtPayload.userId;
        //Get user role from the database
        const userRepository = getRepository(QAUsers);
        let has_roles;
        let user: QAUsers;
        try {
            user = await userRepository.findOneOrFail(id);
            let user_roles: QARoles[] = user.roles;
            let mapped_roles = user_roles.map(role => { return role.description });
            has_roles = mapped_roles.find(role_ => {
                return roles.indexOf(role_) > -1
            });
            console.log(has_roles ? 'has' : 'has not')
            // else res.status(401).send('User unauthorized.');
        } catch (error) {
            res.status(401).send();
        }
        //Check if array of authorized roles includes the user's role
        if (has_roles) next();
        else res.status(401).send();

    };
};


