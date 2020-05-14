import { Router } from "express";
import  * as checkJwt_ from "../middlewares/CheckJwt";
import  * as checkRole_  from "../middlewares/CheckRole";

const checkJwt = checkJwt_.checkJwt
const checkRole = checkRole_.checkRole

// const { checkJwt } = require( "@middlewares/checkJwt");
// const { checkRole } = require( "@middlewares/checkRole");

// import * as checkJwt from "../../src/middlewares/checkJwt";
// import * as checkRole from "../../src/middlewares/checkRole";

import EvaluationsController from "@controllers/EvaluationsController";
import { RolesHandler } from "@helpers/RolesHandler";
import CommentController from "@controllers/CommentController";

const router = Router();


/***
 * 
 * Evaluations
 * 
 */


// get evaluations all
router.get("/", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.crp])], EvaluationsController.getAllEvaluationsDash);

// get evaluations by user
router.get("/:id([0-9]+)", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp])], EvaluationsController.getEvaluationsDash);

// get list evaluations by user
router.post("/:id([0-9]+)/list", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp])], EvaluationsController.getListEvaluationsDash);

// get detailed evaluations by user
router.post("/:id([0-9]+)/detail", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp])], EvaluationsController.getDetailedEvaluationDash);

// update detailed evaluations by user
router.patch("/:id([0-9]+)/detail", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp])], EvaluationsController.updateDetailedEvaluation);

// get crp for admin
router.get("/crp", [checkJwt, checkRole([RolesHandler.admin])], EvaluationsController.getCRPS);

// get active indicators by admin
router.get("/crp/indicators", [checkJwt, checkRole([RolesHandler.admin])], EvaluationsController.getIndicatorsByCrp);

// create comment in indicator item
router.post("/detail/comment", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp])], CommentController.createComment)

// create reply by comment
router.post("/detail/comment/reply", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp])], CommentController.createCommentReply)

// update comment in indicator item
router.patch("/detail/comment", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp])], CommentController.updateComment)

// get comment from indicator item
router.get("/:evaluationId([0-9]+)/detail/comment/:metaId([0-9]+)", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp])], CommentController.getComments)

// get replies by comment
router.get("/:evaluationId([0-9]+)/detail/comment/:commentId([0-9]+)/replies", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp])], CommentController.getCommentsReplies)

// get replies by comment
router.get("/indicator/:indicatorName", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.crp, RolesHandler.assesor])], EvaluationsController.getCriteriaByIndicator)
export default router;