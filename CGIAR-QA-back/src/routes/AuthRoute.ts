import { Router } from "express";
import AuthController from "@controllers/AuthController";
const { checkJwt } = require( "@middleware/checkJwt");
// import * as checkJwt from "../../src/middlewares/CheckJwt";


// import { checkJwt } from "@middleware/checkJwt";

const router = Router();
//Login route
router.post("/login", AuthController.login);

//Change my password
router.post("/change-password", [checkJwt], AuthController.changePassword);
// router.post("/change-password", [checkJwt.checkJwt], AuthController.changePassword);

export default router;