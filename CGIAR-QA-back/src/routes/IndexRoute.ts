import { Router, Request, Response } from "express";
import auth from "./AuthRoute";
import user from "./UsersRoute";
import indicator from "./IndicatorsRoute";

const Routes = Router();

Routes.use("/auth", auth);
Routes.use("/user", user);
Routes.use("/indicator", indicator);

export default Routes;