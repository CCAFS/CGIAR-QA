import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository, getConnection } from "typeorm";
import { validate } from "class-validator";

import config from "@config/config";

import { QAUsers } from "@entity/User";
import { QATokenAuth } from "@entity/TokenAuth";
import { QAGeneralConfiguration } from "@entity/GeneralConfig";
import { QACrp } from "@entity/CRP";
import { QARoles } from "@entity/Roles";
import { RolesHandler } from "@helpers/RolesHandler";
import Util from "@helpers/Util";

const { ErrorHandler } = require("@helpers/ErrorHandler")

class AuthController {
    static login = async (req: Request, res: Response, next: NextFunction) => {

        try {
            //Check if username and password are set
            let { username, password } = req.body;
            if (!(username && password)) {
                res.status(404).json({ message: 'Missing required email and password fields.' })
                // throw new ErrorHandler(404, 'Missing required email and password fields.')
            }

            //Get user from database
            const userRepository = getRepository(QAUsers);
            const grnlConfg = getRepository(QAGeneralConfiguration);
            let user: QAUsers;

            user = await userRepository.findOneOrFail({
                where: [
                    { username },
                    { email: username }
                ]
            });
            if (user.roles.map(role => { return role.description }).find(r => r === RolesHandler.crp)) {
                res.status(401).json({ message: 'Unauthorized' })
            }
            // get general config by user role
            let generalConfig = await grnlConfg
                .createQueryBuilder("qa_general_config")
                .select('*')
                .where(`roleId IN (${user.roles.map(role => { return role.id })})`)
                .andWhere("DATE(qa_general_config.start_date) <= CURDATE()")
                .andWhere("DATE(qa_general_config.end_date) > CURDATE()")
                // .getSql();
                .getRawMany();
            // console.log(generalConfig)
            //Check if encrypted password match
            if (!user.checkIfUnencryptedPasswordIsValid(password)) {
                res.status(401).json({ message: 'Password does not match.' });
            }

            //Sing JWT, valid for ``config.jwtTime`` 
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                config.jwtSecret,
                { expiresIn: config.jwtTime }
            );


            user["token"] = token;
            user["config"] = generalConfig;
            delete user.password;
            //Send the jwt in the response
            res.status(200).json({ data: user })

        } catch (error) {
            console.log(error)
            res.status(400).json(error)
            // next(error)
        }

    };


    static tokenLogin = async (req: Request, res: Response) => {
        try {
            //Check if username and password are set
            let { crp_id, token } = req.body;

            if (!(crp_id && token)) {
                res.status(404).json({ message: 'Not authorized.' })
            }
            let queryRunner = getConnection().createQueryBuilder();

            const [query, parameters] = await queryRunner.connection.driver.escapeQueryWithParameters(
                `SELECT
                    *, (SELECT id FROM qa_crp WHERE crp_id = ${crp_id}) AS qa_crp_id
                FROM
                    qa_token_auth
                WHERE
                    crp_id = :crp_id
                AND
                    token = :token
                AND 
                    DATE(expiration_date) >= CURDATE()
                    `,
                { crp_id, token },
                {}
            );

            let r = await queryRunner.connection.query(query, parameters);
            if (!r.length) {
                res.status(401).json({ data: [], message: 'Invalid token' });
            }
            let auth_token = r[0];
            let user = await Util.createOrReturnUser(auth_token);
            //Send the jwt in the response
            res.status(200).json({ data: user, message: 'CRP Logged' })

        } catch (error) {
            console.log(error)
            res.status(400).json(error)
            // next(error)
        }
    }

    static changePassword = async (req: Request, res: Response) => {
        //Get ID from JWT
        const id = res.locals.jwtPayload.userId;

        //Get parameters from the body
        const { oldPassword, newPassword } = req.body;
        if (!(oldPassword && newPassword)) {
            throw new ErrorHandler(400, 'Passwords are not the same.');
        }

        //Get user from the database
        const userRepository = getRepository(QAUsers);
        let user: QAUsers;
        try {
            user = await userRepository.findOneOrFail(id);
        } catch (id) {
            throw new ErrorHandler(401, 'User not found.');
        }

        //Check if old password matchs
        if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
            throw new ErrorHandler(401, 'Password does not match.');
        }

        //Validate de model (password lenght)
        user.password = newPassword;
        const errors = await validate(user);
        if (errors.length > 0) {
            throw new ErrorHandler(400, errors);
        }
        //Hash the new password and save
        user.hashPassword();
        userRepository.save(user);
        delete user.password;

        res.status(204).send({ data: user });
    };

    static createGeneralConfig = async (req: Request, res: Response) => {
        //get body data
        // console.log(req.body)
        let { end_date, start_date, role, status, peer_review_paper_guideline, policies_guideline, almetrics_guideline,
            anual_report_guideline, innovations_guideline, partnerships_guideline, capdev_guideline, uptake_guideline, oicr_guideline } = req.body;
        try {
            const configRepository = getRepository(QAGeneralConfiguration);
            let config = new QAGeneralConfiguration();
            config.end_date = end_date;
            config.start_date = start_date;
            config.status = status;
            config.role = role;
            config.anual_report_guideline = anual_report_guideline;
            config.innovations_guideline = innovations_guideline;
            config.partnerships_guideline = partnerships_guideline;
            config.capdev_guideline = capdev_guideline;
            config.peer_review_paper_guideline = peer_review_paper_guideline;
            config.policies_guideline = policies_guideline;
            config.almetrics_guideline = almetrics_guideline;
            config.uptake_guideline = uptake_guideline;
            config.oicr_guideline = oicr_guideline;


            config = await configRepository.save(config);

            res.status(200).send({ data: config });

        } catch (error) {
            console.log(error)
            res.status(400).send({ data: error, message: 'Configuration can not be created' });
        }
    }
    
}
export default AuthController;