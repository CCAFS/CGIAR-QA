import { Router } from "express";
import { checkJwt } from "@middleware/checkJwt";
import { checkRole } from "@middleware/checkRole";
// const { checkJwt } = require( "@middlewares/checkJwt");
// const { checkRole } = require( "@middlewares/checkRole");

// import * as checkJwt from "../../src/middlewares/checkJwt";
// import * as checkRole from "../../src/middlewares/checkRole";

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
// router.get("/", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], EvaluationsController.getAllEvaluationsDash);
// get evaluations by user
router.get("/:id([0-9]+)", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor])], EvaluationsController.getEvaluationsDash);
// router.get("/:id([0-9]+)", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin, RolesHandler.assesor])], EvaluationsController.getEvaluationsDash);
// get crp by user
router.get("/crp", [checkJwt, checkRole([RolesHandler.admin])], EvaluationsController.getCRPS);
// router.get("/crp", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], EvaluationsController.getCRPS);
// get crp by user
router.get("/crp/indicators", [checkJwt, checkRole([RolesHandler.admin])], EvaluationsController.getIndicatorsByCrp);
// router.get("/crp/indicators", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], EvaluationsController.getIndicatorsByCrp);

export default router;