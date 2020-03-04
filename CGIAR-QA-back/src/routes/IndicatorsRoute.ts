import { Router } from "express";
import { checkJwt } from "@middleware/checkJwt";
// import { checkRole } from "@middleware/checkRole";
// const { checkJwt } = require( "@middlewares/checkJwt");
// const { checkRole } = require( "@middlewares/checkRole");

// import * as checkJwt from "../../src/middlewares/checkJwt";
// import * as checkRole from "../../src/middlewares/checkRole";

import IndicatorsController from "@controllers/IndicatorsController";
import { RolesHandler } from "@helpers/RolesHandler";

const router = Router();



/***
 * 
 * Indicators
 * 
 */

// create indicator
// router.post("/", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], IndicatorsController.createIndicator);
// // assing indicator
// router.post("/assign", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], IndicatorsController.assignIndicatorToUser);
// // get all indicators
// router.get("/", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp, RolesHandler.guest])], IndicatorsController.getAllIndicators);
// // edit indicator
// router.patch("/:id([0-9]+)", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], IndicatorsController.editIndicators);
// // // delete indicator
// router.delete("/:id([0-9]+)", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], IndicatorsController.deleteIndicators);
// // get indicator by user
// router.get("/user/:id([0-9]+)", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp, RolesHandler.guest])], IndicatorsController.getIndicatorsByUser);


export default router;