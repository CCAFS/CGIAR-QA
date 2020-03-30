import { Router, Request, Response } from "express";
import auth from "./AuthRoute";
import user from "./UsersRoute";
import indicator from "./IndicatorsRoute";
import evaluation from "./EvaluationsRoute";
import comment from "./CommentsRoute";

const Routes = Router();

Routes.use("/auth", auth);
Routes.use("/user", user);
Routes.use("/indicator", indicator);
Routes.use("/evaluation", evaluation);
Routes.use("/comment", comment);

export default Routes;