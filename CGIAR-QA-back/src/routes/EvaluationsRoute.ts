import { Router } from "express";
// import { checkJwt } from "@middlewares/checkJwt";
// import { checkRole } from "@middlewares/checkRole";
const { checkJwt } = require( "@middlewares/checkJwt");
const { checkRole } = require( "@middlewares/checkRole");

import EvaluationsController from "@controllers/EvaluationsController";
import { RolesHandler } from "@helpers/RolesHandler";

const router = Router();


/***
 * 
 * Evaluations
 * 
 */

// get all evaluations *** ADMIN ***
// router.get("/", [checkJwt, checkRole([RolesHandler.admin])], EvaluationsController.getAllEvaluations);

// get evaluations all
router.get("/", [checkJwt, checkRole([RolesHandler.admin])], EvaluationsController.getAllEvaluationsDash);
// get evaluations by user
router.get("/:id([0-9]+)", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor])], EvaluationsController.getEvaluationsDash);
// get crp by user
router.get("/crp", [checkJwt, checkRole([RolesHandler.admin])], EvaluationsController.getCRPS);
// get crp by user
router.get("/crp/indicators", [checkJwt, checkRole([RolesHandler.admin])], EvaluationsController.getIndicatorsByCrp);

export default router;