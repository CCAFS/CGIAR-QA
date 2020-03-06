import { Router } from "express";
import AuthController from "@controllers/AuthController";
import { RolesHandler } from "@helpers/RolesHandler";

const { checkJwt } = require( "@middleware/checkJwt");
const { checkRole } = require( "@middleware/CheckRole");




const router = Router();
//Login route
router.post("/login", AuthController.login);

//Change my password
router.post("/change-password", [checkJwt], AuthController.changePassword);
// router.post("/change-password", [checkJwt.checkJwt], AuthController.changePassword);

//Change my password
router.post("/create-config", [checkJwt, checkRole([RolesHandler.admin])], AuthController.createGeneralConfig);


export default router;