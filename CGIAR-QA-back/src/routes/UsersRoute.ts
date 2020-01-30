import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

import UserController from "../controllers/UserController";
import { RolesHandler } from "../_helpers/RolesHandler";


const router = Router();

//Get all users
router.get("/all", [checkJwt, checkRole([RolesHandler.admin])], UserController.listAll);

// Get one user
router.get(
    "/:id([0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12})",
    [checkJwt, checkRole([RolesHandler.admin])],
    UserController.getOneById
);

//Create a new user
router.post("/", [checkJwt, checkRole([RolesHandler.admin])], UserController.newUser);

//Edit one user
router.patch(
    "/:id([0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12})",
    [checkJwt, checkRole([RolesHandler.admin])],
    UserController.editUser
);

//Delete one user
router.delete(
    "/:id([0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12})",
    [checkJwt, checkRole([RolesHandler.admin])],
    UserController.deleteUser
);

export default router;