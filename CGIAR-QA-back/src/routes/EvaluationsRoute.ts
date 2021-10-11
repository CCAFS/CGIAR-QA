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
// get evaluations all
router.get("/status/crp", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.crp])], EvaluationsController.getAllEvaluationsDashByCRP);

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

//TAGS

// create tag in comment item
router.get("/detail/comment/tag/:commentId([0-9]+)/:tagTypeId([0-9]+)/:userId([0-9]+)", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor])], CommentController.getTagId)

// create tag in comment item
router.post("/detail/comment/tag", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor])], CommentController.createTag)

// create tag in comment item
router.delete("/detail/comment/tag/:id([0-9]+)", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor])], CommentController.deleteTag)

// create comment in indicator item
router.post("/detail/comment", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp])], CommentController.createComment)

// create reply by comment
router.post("/detail/comment/reply", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp])], CommentController.createCommentReply)

// update comment in indicator item
router.patch("/detail/comment", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp])], CommentController.updateComment)

// update comment in indicator item
router.patch("/detail/comment/reply", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.crp])], CommentController.updateCommentReply)

// get comment from indicator item
router.get("/:evaluationId([0-9]+)/detail/comment/:metaId([0-9]+)", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp])], CommentController.getComments)

// get replies by comment
router.get("/:evaluationId([0-9]+)/detail/comment/:commentId([0-9]+)/replies", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp])], CommentController.getCommentsReplies)

// get Criteria By Indicator
router.get("/indicator/:indicatorName", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.crp, RolesHandler.assesor])], EvaluationsController.getCriteriaByIndicator)

// get assessors by evaluation
router.get("/:evaluationId([0-9]+)/assessors", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor])], EvaluationsController.getAssessorsByEvaluations)

// update require_second_assessment in indicator item
router.patch("/:id([0-9]+)/detail/second_assessment", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor])], EvaluationsController.updateRequireSecondEvaluation)
export default router;