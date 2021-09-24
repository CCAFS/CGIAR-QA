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
import CommentController from "@controllers/CommentController";

const router = Router();



/***
 * 
 * Indicators
 * 
 */ 
router.post("/", [checkJwt, checkRole([RolesHandler.admin])], IndicatorsController.createIndicator);

// // assing indicator
router.post("/assign", [checkJwt, checkRole([RolesHandler.admin])], IndicatorsController.assignIndicatorToUser);

// // get all indicators
router.get("/", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp, RolesHandler.guest])], IndicatorsController.getAllIndicators);

// // edit indicator
router.patch("/:id([0-9]+)", [checkJwt, checkRole([RolesHandler.admin])], IndicatorsController.editIndicators);


// // // delete indicator
router.delete("/:id([0-9]+)", [checkJwt, checkRole([RolesHandler.admin])], IndicatorsController.deleteIndicators);

// // get indicator by user
router.get("/user/:id([0-9]+)", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor, RolesHandler.crp, RolesHandler.guest])], IndicatorsController.getIndicatorsByUser);

// // edit indicator by user
router.patch("/:id([0-9]+)/user", [checkJwt, checkRole([RolesHandler.admin])], CommentController.editCommentsMeta);

// get item indicators status
router.get("/items/:indicator", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor])], IndicatorsController.getItemStatusByIndicator); 

// get ALL item status by indicator
router.get("/items", [checkJwt, checkRole([RolesHandler.admin, RolesHandler.assesor])], IndicatorsController.getAllItemStatusByIndicator);

// get ALL item status by indicator and CRP for MIS
router.get("/:id([0-9]+)/crp/:crp_id/items", [checkJwt, checkRole([RolesHandler.admin])], IndicatorsController.getItemListStatusMIS);

// get item status by indicator and CRP for MIS
router.get("/:id([0-9]+)/crp/:crp_id/item/:item_id", [checkJwt, checkRole([RolesHandler.admin])], IndicatorsController.getItemStatusMIS);

export default router;