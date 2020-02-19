import { Router } from "express";
import { checkJwt } from "../middlewares/checkJwt";
import { checkRole } from "../middlewares/checkRole";

import EvaluationsController from "../controllers/EvaluationsController";
import { RolesHandler } from "../_helpers/RolesHandler";

const router = Router();


/***
 * 
 * Evaluations
 * 
 */

// get all evaluations *** ADMIN ***
// router.get("/", [checkJwt, checkRole([RolesHandler.admin])], EvaluationsController.getAllEvaluations);

// get evaluations by user
router.get("/:id([0-9]+)", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor])], EvaluationsController.getEvaluationsDash);

export default router;