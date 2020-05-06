// import 'module-alias/register';
// require('module-alias/register');
import "reflect-metadata";
require('module-alias/register')
import { createConnection } from "typeorm";
import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import Routes from "@routes/IndexRoute";
import config from "@config/config";
const { handleError } = require('./_helpers/ErrorHandler');


//Connects to the Database -> then starts the express
createConnection()
    .then(async connection => {
        // Create a new express application instance
        const app = express();

        // Call midlewares
        app.use(cors());
        app.use(helmet());
        app.use(bodyParser.json());



        //Set all routes from routes folder
        app.use("/", Routes);

        //Handle Errors
        app.use((err, req, res, next) => {
            handleError(err, res);
        });
        let server = app.listen(config.port, config.host, () => {
            // let host = app.address().address;
            // let port = app.address().port;
            console.log(`Server started on port ${config.port} and host ${config.host}!`);
        });
    })
    .catch(error => console.log('createConnection', error));