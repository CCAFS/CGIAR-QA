import { Router } from "express";
import  * as checkJwt_ from "../middlewares/CheckJwt";
import  * as checkRole_  from "../middlewares/CheckRole";

import { RolesHandler } from "@helpers/RolesHandler";
import CommentController from "@controllers/CommentController";

const checkJwt = checkJwt_.checkJwt
const checkRole = checkRole_.checkRole

const router = Router();


//Get answering/pending comments
router.get("/", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.crp])], CommentController.commentsCount);


export default router;