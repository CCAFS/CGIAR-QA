import { Router } from "express";
// import { checkJwt } from "@middleware/checkJwt";
// import { checkRole } from "@middleware/checkRole";
// const { checkJwt } = require( "@middlewares/checkJwt");
// const { checkRole } = require( "@middlewares/checkRole");

import * as checkJwt from "../middlewares/checkJwt";
import * as checkRole from "../middlewares/checkRole";

import UserController from "@controllers/UserController";
import { RolesHandler } from "@helpers/RolesHandler";


const router = Router();

/***
 * 
 * Users
 * 
 */

//Get all users
router.get("/all", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], UserController.listAll);

// Get one user
router.get(
    "/:id([0-9]+)",
    [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])],
    UserController.getOneById
);

//Create a new user
router.post("/", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], UserController.newUser);

//Edit one user
router.patch(
    "/:id([0-9]+)",
    [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])],
    UserController.editUser
);

//Delete one user
router.delete(
    "/:id([0-9]+)",
    [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])],
    UserController.deleteUser
);


/***
 * 
 * Roles
 * 
 */

// create role
router.post("/role", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], UserController.createRole);
// get roles
router.get("/role", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], UserController.getAllRoles);
// edit role
router.patch("/role/:id([0-9]+)", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], UserController.editRole);
// delete role
router.delete("/role/:id([0-9]+)", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], UserController.deleteRole);

/***
 * 
 * Permissions
 * 
 */
// create permissions
router.post("/permission", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], UserController.createPermission);
// get permissions
router.get("/permission", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], UserController.getAllPermissions);
// delete role
router.delete("/permission/:id([0-9]+)", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], UserController.deletePermissions);
// edit role
router.patch("/permission/:id([0-9]+)", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], UserController.editPermissions);



export default router;