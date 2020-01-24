import { Router, Request, Response } from "express";
import auth from "./AuthRoute";
import user from "./UsersRoute";

const Routes = Router();

Routes.use("/auth", auth);
Routes.use("/user", user);

export default Routes;