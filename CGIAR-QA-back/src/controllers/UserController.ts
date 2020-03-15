import { Request, Response } from "express";
import { getRepository, In } from "typeorm";
import { validate, validateOrReject } from "class-validator";

import { QAUsers } from "@entity/User";
import { QARoles } from "@entity/Roles";
import { QAPermissions } from "@entity/Permissions";

// import { QAPolicies } from "../entity/PoliciesView";

// const { ErrorHandler, handleError } = require("../_helpers/ErrorHandler");



class UserController {


    /**
     * 
     * User CRUD
     * 
     */


    static listAll = async (req: Request, res: Response) => {
        //Get users from database
        try {
            const userRepository = getRepository(QAUsers);
            const users = await userRepository.find({ relations: ["indicators"],});

            //Send the users object
            res.status(200).json({ data: users, message: "All users" });

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Could not access to users." });
        }
    };

    static newUser = async (req: Request, res: Response) => {

        //Get parameters from the body
        let { username, password, roles, name, email } = req.body;
        const roleRepository = getRepository(QARoles);

        let user = new QAUsers();
        user.username = username;
        user.password = password;
        user.name = name;
        user.email = email;
        // user.indicators = indicators;

        try {
            // assing role for user
            let repositoryRoles = await roleRepository.find({
                id: In(roles)
            });
            user.roles = repositoryRoles;

            if (repositoryRoles.length === 0) {
                res.status(409).json({ message: "Role does not exists" });
                return;
            }

        } catch (error) {
            res.status(409).json({ message: "Role does not exists" });
            return;
        }

        //Validade if the parameters are ok
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).json({ data: errors, message: "Error found" });
            return;
        }

        //Hash the password, to securely store on DB
        user.hashPassword();

        //Try to save. If fails, the username is already in use
        const userRepository = getRepository(QAUsers);
        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).json({ message: "Username already in use" });
            return;
        }

        //If all ok, send 200 response
        res.status(200).json({ message: "User created" });

    };

    static getOneById = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id: any = req.params.id;

        //Get the user from database
        const userRepository = getRepository(QAUsers);
        try {
            const user = await userRepository.findOneOrFail(id, {
                // select: ["id", "username", "role", "indicators", "name", "email"] //We dont want to send the password on response
            });
            res.status(200).json({ data: user, message: "User" });
        } catch (error) {
            console.log(error)
            // throw new ErrorHandler(404, 'User not found.')
            res.status(404).json({ message: "User not found" });
        }
    };

    static editUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        //Get values from the body
        let { username, roles, name, email } = req.body;
        const roleRepository = getRepository(QARoles);

        //Try to find user on database
        const userRepository = getRepository(QAUsers);
        let user;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).json({ message: 'User not found.' });
            // throw new ErrorHandler(404, 'User not found.');
        }

        user.username = username;
        user.name = name;
        user.email = email;
        // user.indicators = indicators;

        try {
            // assing role for user
            let repositoryRoles = await roleRepository.find({
                id: In(roles)
            });
            user.roles = repositoryRoles;

            if (repositoryRoles.length === 0) {
                res.status(409).json({ message: "Role does not exists" });
                return;
            }

        } catch (error) {
            res.status(409).json({ message: "Role does not exists" });
            return;
        }

        //Validate the new values on model
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).json({ message: errors });
            return;
        }

        //Try to safe, if fails, that means username already in use
        try {
            await userRepository.save(user);
        } catch (e) {
            res.status(409).json({ message: "Name already in use" });
        }
        //After all send a 200 accepted response
        res.status(200).json({ message: 'User updated.' });
    };

    static deleteUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        const userRepository = getRepository(QAUsers);
        let user: QAUsers;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (error) {
            res.status(400).json({ message: 'User not found.' });
        }
        userRepository.delete(id);

        //After all send a 204 (no content, but accepted) response
        res.status(200).json({ message: "User deleted sucessfully" });
    };


    /**
     * 
     * Roles CRUD
     * 
     */
    static getAllRoles = async (req: Request, res: Response) => {

        //Get all active roles

        try {
            const rolesRepository = getRepository(QARoles);
            const roles = await rolesRepository
                .createQueryBuilder("qa_roles")
                .getMany();

            //Send the roles object
            res.status(200).json({ data: roles, message: "All roles" });

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Could not access to roles." });
        }

    }

    static createRole = async (req: Request, res: Response) => {

        //Get parameters from the body
        let { description, acronym, is_active, permissions } = req.body;
        const permissionRepository = getRepository(QAPermissions);

        let role = new QARoles();
        role.description = description;
        role.acronym = acronym;
        role.is_active = is_active;


        try {
            // assing role for user
            let repositoryPermissions = await permissionRepository.find({
                id: In(permissions)
            });
            role.permissions = repositoryPermissions;

            if (repositoryPermissions.length === 0) {
                res.status(409).json({ message: "Permissions does not exists" });
                return;
            }

        } catch (error) {
            res.status(409).json({ message: "Permissions does not exists" });
            return;
        }

        //Validade if the parameters are ok
        const errors = await validate(role);
        if (errors.length > 0) {
            res.status(400).json({ data: errors, message: "Error found" });
            return;
        }

        const roleRepository = getRepository(QARoles);
        try {
            await roleRepository.save(role);
        } catch (e) {
            res.status(409).json({ message: "Role already in use" });
            return;
        }

        //If all ok, send 200 response
        res.status(200).json({ message: "Role created" });

    }

    static editRole = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
        //Get values from the body
        let { description, acronym, is_active, permissions } = req.body;

        const permissionRepository = getRepository(QAPermissions);
        const roleRepository = getRepository(QARoles);

        let role;

        try {
            // get role
            role = await roleRepository.findOneOrFail(id);
            // assing role for user
            let repositoryPermissions = await permissionRepository.find({
                id: In(permissions)
            });

            role.permissions = repositoryPermissions;
            if (repositoryPermissions.length === 0) {
                res.status(409).json({ message: "Permissions does not exists" });
                return;
            }

        } catch (error) {
            console.log(error)
            res.status(409).json({ message: "Error editing role." });
            return;
        }


        //Validate the new values on model
        role.description = description;
        role.acronym = acronym;
        role.is_active = is_active;
        const errors = await validate(role);
        if (errors.length > 0) {
            res.status(400).json({ message: errors });
            return;
        }


        try {
            await roleRepository.save(role);
        } catch (e) {
            res.status(404).json({ message: "Role cant be edited" });
        }
        //After all send a 200 accepted response
        res.status(200).json({ message: 'Role updated.' });
    };

    static deleteRole = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        const roleRepository = getRepository(QARoles);
        let role;
        try {
            role = await roleRepository.findOneOrFail(id);
        } catch (error) {
            res.status(400).json({ message: 'Role not found.' });
        }
        roleRepository.delete(id);

        //After all send a 204 (no content, but accepted) response
        res.status(200).json({ message: "Role deleted sucessfully" });
    };


    /**
     * 
     * Permissions CRUD
     * 
     */

    static createPermission = async (req: Request, res: Response) => {

        //Get parameters from the body
        let { description, permission } = req.body;

        let _permission = new QAPermissions();
        _permission.description = description;
        _permission.permission = permission;


        //Validade if the parameters are ok
        const errors = await validate(_permission);
        if (errors.length > 0) {
            res.status(400).json({ data: errors, message: "Error found" });
            return;
        }

        const permissionRepository = getRepository(QAPermissions);
        try {
            await permissionRepository.save(_permission);
        } catch (e) {
            res.status(409).json({ message: "Permission already in created" });
            return;
        }

        //If all ok, send 200 response
        res.status(200).json({ message: "Permission created" });

    }


    static getAllPermissions = async (req: Request, res: Response) => {

        //Get all active permissions

        try {
            const permissionsRepository = getRepository(QAPermissions);
            const permissions = await permissionsRepository.find({
                select: ["id", "description", "permission"]
            });

            //Send the users object
            res.status(200).json({ data: permissions, message: "All permissions" });

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Could not access to permissions." });
        }

    }

    static deletePermissions = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        const permissionRepository = getRepository(QAPermissions);
        let permission: QAPermissions;
        try {
            permission = await permissionRepository.findOneOrFail(id);
        } catch (error) {
            res.status(400).json({ message: 'Permission not found.' });
        }
        permissionRepository.delete(id);

        //After all send a 204 (no content, but accepted) response
        res.status(200).json({ message: "Permission deleted sucessfully" });
    };

    static editPermissions = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
        //Get values from the body
        let { description, permission } = req.body;

        const permissionRepository = getRepository(QAPermissions);


        //Try to find user on database
        let _permission;

        try {
            // get permission
            _permission = await permissionRepository.findOneOrFail(id);
        } catch (error) {
            console.log(error)
            res.status(409).json({ message: "Error editing role." });
            return;
        }


        //Validate the new values on model
        _permission.description = description;
        _permission.permission = permission;

        const errors = await validate(_permission);
        if (errors.length > 0) {
            res.status(400).json({ message: errors });
            return;
        }


        try {
            await permissionRepository.save(_permission);
        } catch (e) {
            res.status(404).json({ message: "Permission can't be edited" });
        }
        //After all send a 200 accepted response
        res.status(200).json({ message: 'Permission updated.' });
    };






};

export default UserController;