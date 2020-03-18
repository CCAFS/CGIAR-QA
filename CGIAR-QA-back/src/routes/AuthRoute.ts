import { Router } from "express";
import AuthController from "@controllers/AuthController";
import { RolesHandler } from "@helpers/RolesHandler";

import  * as checkJwt_ from "../middlewares/CheckJwt";
import  * as checkRole_  from "../middlewares/CheckRole";

const checkJwt = checkJwt_.checkJwt
const checkRole = checkRole_.checkRole


const router = Router();
//Login route
router.post("/login", AuthController.login);

//Change my password
router.post("/change-password", [checkJwt], AuthController.changePassword);
// router.post("/change-password", [checkJwt.checkJwt], AuthController.changePassword);

//Change my password
router.post("/create-config", [checkJwt, checkRole([RolesHandler.admin])], AuthController.createGeneralConfig);


export default router;