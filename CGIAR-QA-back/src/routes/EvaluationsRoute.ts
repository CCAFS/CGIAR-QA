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


// get evaluations all
router.get("/", [checkJwt, checkRole([RolesHandler.admin])], EvaluationsController.getAllEvaluationsDash);
// router.get("/", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], EvaluationsController.getAllEvaluationsDash);
// get evaluations by user
router.get("/:id([0-9]+)", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor])], EvaluationsController.getEvaluationsDash);
// router.get("/:id([0-9]+)", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin, RolesHandler.assesor])], EvaluationsController.getEvaluationsDash);
// get list evaluations by user
router.post("/:id([0-9]+)/list", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor])], EvaluationsController.getListEvaluationsDash);
// get detailed evaluations by user
router.post("/:id([0-9]+)/detail", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor])], EvaluationsController.getDetailedEvaluationDash);
// get crp by user
router.get("/crp", [checkJwt, checkRole([RolesHandler.admin])], EvaluationsController.getCRPS);
// router.get("/crp", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], EvaluationsController.getCRPS);
// get crp by user
router.get("/crp/indicators", [checkJwt, checkRole([RolesHandler.admin])], EvaluationsController.getIndicatorsByCrp);
// router.get("/crp/indicators", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], EvaluationsController.getIndicatorsByCrp);

export default router;