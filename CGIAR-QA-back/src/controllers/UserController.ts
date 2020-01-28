import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
const { ErrorHandler } = require("../_helpers/ErrorHandler");
import RolesHandler from "../_helpers/RolesHandler";


class UserController {

    static listAll = async (req: Request, res: Response) => {
        //Get users from database
        try {
            const userRepository = getRepository(User);
            const users = await userRepository.find({
                select: ["id", "username", "role"] //We dont want to send the passwords on response
            });

            //Send the users object
            res.status(200).json({ data: users });

        } catch (error) {
            console.log(error)
            throw new ErrorHandler(404, 'Could not access to users.')
        }
    };

    static getOneById = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: any = req.params.id;

        //Get the user from database
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(id, {
                select: ["id", "username", "role"] //We dont want to send the password on response
            });
            res.status(200).json({ data: user });
        } catch (error) {
            console.log(error)
            throw new ErrorHandler(404, 'User not found.')
            // res.status(404).send("User not found");
        }
    };

    static newUser = async (req: Request, res: Response) => {
        //Get parameters from the body
        let { username, password, role } = req.body;
       
        let user = new User();
        user.username = username;
        user.password = password;
        user.role = role;
        
        //Validade if the parameters are ok
        const errors = await validate(user);
        if (errors.length > 0) {
            throw new ErrorHandler(400, errors);
        }

        //Hash the password, to securely store on DB
        user.hashPassword();

        //Try to save. If fails, the username is already in use
        const userRepository = getRepository(User);
        try {
            await userRepository.save(user);
        } catch (e) {
            console.log(e)
            throw new ErrorHandler(409, 'Username already in use.')
        }

        //If all ok, send 201 response
        res.status(201).json({ data: "User created" });
    };

    static editUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        //Get values from the body
        const { username, role } = req.body;

        //Try to find user on database
        const userRepository = getRepository(User);
        let user;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            //If not found, send a 404 response
            throw new ErrorHandler(404, 'User not found.');
        }

        //Validate the new values on model
        user.username = username;
        user.role = role;
        const errors = await validate(user);
        if (errors.length > 0) {
            throw new ErrorHandler(400, errors);
        }

        //Try to safe, if fails, that means username already in use
        try {
            await userRepository.save(user);
        } catch (e) {
            throw new ErrorHandler(409, "Username already in use");
        }
        //After all send a 204 (accepted) response
        res.status(204).json({data:'User updated sucessfully'})
        // res.status(204).send();
    };

    static deleteUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            throw new ErrorHandler(404, 'User not found.');
        }
        userRepository.delete(id);

        //After all send a 204 (no content, but accepted) response
        res.status(204).send();
    };
};

export default UserController;