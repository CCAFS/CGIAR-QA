import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
const { ErrorHandler } = require("../_helpers/ErrorHandler")

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    //Get the jwt token from the head
    const token = <string>req.headers["authorization"];
    let jwtPayload;
   

    //Try to validate the token and get data
    try {
        jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        console.log("checkJwt erorr")
        console.log(error)
        //If token is not valid, respond with 401 (unauthorized)
        throw new ErrorHandler(401, error.message);
    }
    
    //The token is valid for ``config.jwtTime``
    //We want to send a new token on every request
    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
        expiresIn: config.jwtTime
    });
    res.setHeader("token", newToken);
    
    //Call the next middleware or controller
    next();
};