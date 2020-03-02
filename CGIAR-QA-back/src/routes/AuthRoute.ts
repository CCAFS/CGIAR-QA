import { Router } from "express";
import AuthController from "../controllers/AuthController";
import * as checkJwt from "@middlewares/checkJwt";
// import { checkJwt } from "@middlewares/checkJwt";
// import { checkJwt } from "../middlewares/checkJwt";

const router = Router();
//Login route
router.post("/login", AuthController.login);

//Change my password
router.post("/change-password", [checkJwt.checkJwt], AuthController.changePassword);

export default router;