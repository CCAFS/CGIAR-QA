import { Router } from "express";
import  * as checkJwt_ from "../middlewares/CheckJwt";
import  * as checkRole_  from "../middlewares/CheckRole";

const checkJwt = checkJwt_.checkJwt
const checkRole = checkRole_.checkRole
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
router.post("/", [checkJwt, checkRole([RolesHandler.admin])], IndicatorsController.createIndicator);
// router.post("/", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], IndicatorsController.createIndicator);
// // assing indicator
router.post("/assign", [checkJwt, checkRole([RolesHandler.admin])], IndicatorsController.assignIndicatorToUser);
// router.post("/assign", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], IndicatorsController.assignIndicatorToUser);
// // get all indicators
router.get("/", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp, RolesHandler.guest])], IndicatorsController.getAllIndicators);
// router.get("/", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp, RolesHandler.guest])], IndicatorsController.getAllIndicators);
// // edit indicator
router.patch("/:id([0-9]+)", [checkJwt, checkRole([RolesHandler.admin])], IndicatorsController.editIndicators);
// router.patch("/:id([0-9]+)", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], IndicatorsController.editIndicators);
// // // delete indicator
router.delete("/:id([0-9]+)", [checkJwt, checkRole([RolesHandler.admin])], IndicatorsController.deleteIndicators);
// router.delete("/:id([0-9]+)", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin])], IndicatorsController.deleteIndicators);
// // get indicator by user
router.get("/user/:id([0-9]+)", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp, RolesHandler.guest])], IndicatorsController.getIndicatorsByUser);
// router.get("/user/:id([0-9]+)", [checkJwt.checkJwt, checkRole.checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp, RolesHandler.guest])], IndicatorsController.getIndicatorsByUser);


export default router;