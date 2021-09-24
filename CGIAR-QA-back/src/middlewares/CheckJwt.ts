import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "@config/config";
import AuthController from "@controllers/AuthController";
import Util from "@helpers/Util";
import { BaseError } from "@helpers/BaseError";
const { ErrorHandler } = require("@helpers/ErrorHandler")

export const checkJwt = async (req: Request, res: Response, next: NextFunction) => {

    // get credential if is application user
    const authBasic = req.headers.authorization;
    const credentials = authBasic ? authBasic.split('Basic ')[1] : null;



    //Get the jwt token from the head
    let jwtPayload, token_;


    //Try to validate the token and get data
    try {
        if(credentials) {
            // decode nase 64 string
            let cre = Buffer.from(credentials, 'base64').toString('utf-8')
            // basic auth token creation
            const email = cre.split(':')[0];
            const password = cre.split(':')[1];
        
            
            const { token } = await Util.login(email, password);
            // get token
            token_ = token;
        } else {
            token_ = <string>req.headers["authorization"];
        }
        jwtPayload = <any>jwt.verify(token_, config.jwtSecret);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        // console.log("checkJwt erorr", error)
        //If token is not valid, respond with 401 (unauthorized)
        error = new BaseError(error.name, 401, error.description, false);
        return res.status(error.httpCode).json(error.description);
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