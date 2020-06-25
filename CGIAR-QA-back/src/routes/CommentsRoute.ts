import { Router } from "express";
import * as checkJwt_ from "../middlewares/CheckJwt";
import * as checkRole_ from "../middlewares/CheckRole";

import { RolesHandler } from "@helpers/RolesHandler";
import CommentController from "@controllers/CommentController";

const checkJwt = checkJwt_.checkJwt
const checkRole = checkRole_.checkRole

const router = Router();


//Get answering/pending comments
router.get("/", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp])], CommentController.commentsCount);

//Get answering/pending comments
router.get("/meta", [checkJwt, checkRole([RolesHandler.admin])], CommentController.createcommentsMeta);

// excel for comments
router.get("/excel/:evaluationId", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp])], CommentController.getCommentsExcel);

// set comments as approved
router.post("/approved/:evaluationId", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor])], CommentController.toggleApprovedNoComments);

// get comments raw data
router.get("/raw/:crp_id", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.crp])], CommentController.getRawCommentsData);

// get cycles data
router.get("/cycles", [checkJwt, checkRole([RolesHandler.admin])], CommentController.getCycles);

// get cycles data
router.patch("/cycles/update", [checkJwt, checkRole([RolesHandler.admin])], CommentController.updateCycle);


export default router;