import { Request, Response } from "express";
import { getRepository, Index } from "typeorm";
import { validate, validateOrReject } from "class-validator";

import { QAUser } from "../entity/User";
const { ErrorHandler, handleError } = require("../_helpers/ErrorHandler");



class UserController {
    static listAll = async (req: Request, res: Response) => {
        //Get users from database
        try {
            const userRepository = getRepository(QAUser);
            const users = await userRepository.find({
                select: ["id", "username", "role", "indicators", "name", "email"] //We dont want to send the passwords on response
            });

            //Send the users object
            res.status(200).json({ data: users, message: "All users" });

        } catch (error) {
            console.log(error)
            // throw new ErrorHandler(404, 'Could not access to users.')
            res.status(404).json({ message: "Could not access to users."});
        }
    };

    static newUser = async (req: Request, res: Response) => {

        //Get parameters from the body
        let { username, password, role, name, email, indicators } = req.body;

        let user = new QAUser();
        user.username = username;
        user.password = password;
        user.role = role;
        user.name = name;
        user.email = email;
        user.indicators = indicators;


        //Validade if the parameters are ok
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).json({ data: errors, message: "Error found" });
            return;
        }

        //Hash the password, to securely store on DB
        user.hashPassword();

        //Try to save. If fails, the username is already in use
        const userRepository = getRepository(QAUser);
        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).json({ message: "Username already in use" });
            return;
        }

        //If all ok, send 201 response
        res.status(200).json({ message: "User created" });

    };

    static getOneById = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: any = req.params.id;

        //Get the user from database
        const userRepository = getRepository(QAUser);
        try {
            const user = await userRepository.findOneOrFail(id, {
                select: ["id", "username", "role", "indicators", "name", "email"] //We dont want to send the password on response
            });
            res.status(200).json({ data: user, message: "User" });
        } catch (error) {
            console.log(error)
            // throw new ErrorHandler(404, 'User not found.')
            res.status(404).json({ message: "User not found"});
        }
    };

    static editUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        //Get values from the body
        let { username, role, name, email, indicators } = req.body;

        //Try to find user on database
        const userRepository = getRepository(QAUser);
        let user;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).json({ message: 'User not found.' });
            // throw new ErrorHandler(404, 'User not found.');
        }

        //Validate the new values on model
        user.username = username;
        user.role = role;
        user.name = name;
        user.email = email;
        user.indicators = indicators;
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).json({ message: errors });
            return;
        }

        //Try to safe, if fails, that means username already in use
        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(404).json({ message: "Name already in use" });
        }
        //After all send a 200 accepted response
        res.status(200).json({ message: 'User updated.' });
    };

    static deleteUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        const userRepository = getRepository(QAUser);
        let user: QAUser;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            res.status(400).json({ message: 'User not found.' });
        }
        userRepository.delete(id);

        //After all send a 204 (no content, but accepted) response
        res.status(200).json({ message: "User deleted sucessfully" });
    };


};

export default UserController;