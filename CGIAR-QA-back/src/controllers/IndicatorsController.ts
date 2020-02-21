import { Request, Response } from "express";
import { getRepository, createQueryBuilder, getConnection } from "typeorm";
import { validate } from "class-validator";

import { QAUsers } from "../entity/User";
import { QAIndicators } from "../entity/Indicators";
import { QAIndicatorUser } from "../entity/IndicatorByUser";
import { QAEvaluations } from "../entity/Evaluations";
import { QAIndicatorsMeta } from "../entity/IndicatorsMeta";

import { StatusHandler } from "../_helpers/StatusHandler"


class IndicatorsController {

    /**
     * 
     * Indicators CRUD
     * 
     */


    static getAllIndicators = async (req: Request, res: Response) => {
        //Get indicators from database
        try {
            const indicatorRepository = getRepository(QAIndicators);
            const indicators = await indicatorRepository.find({});

            //Send the indicators object
            res.status(200).json({ data: indicators, message: "All indicators" });

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Could not access to indicators." });
        }
    };


    static getIndicatorsByUser = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;
        //Get indicators from database
        try {
            const indicatorByUserRepository = getRepository(QAIndicatorUser);
            // const indicators = await indicatorRepository.find({});
            const indicators = await indicatorByUserRepository.find({
                relations: ["indicator"],
                where: { user: id },
                select: ["id", 'indicator']
            });

            // delete indicators.user_indicator;

            //Send the indicators object
            res.status(200).json({ data: indicators, message: "User indicators" });

        } catch (error) {
            console.log(error);
            res.status(404).json({ message: "Could not access to indicators." });
        }
    }

    static createIndicator = async (req: Request, res: Response) => {

        let { name, description, view_name } = req.body;

        let indicator = new QAIndicators();
        indicator.name = name;
        indicator.description = description;
        indicator.view_name = view_name;

        //Validade if the parameters are ok
        const errors = await validate(indicator);
        if (errors.length > 0) {
            res.status(400).json({ data: errors, message: "Error found" });
            return;
        }
        const indicatorRepository = getRepository(QAIndicators);

        //Get indicators from database
        try {
            await indicatorRepository.save(indicator);
        } catch (e) {
            res.status(409).json({ message: "Indicator already in use" });
            return;
        }

        //If all ok, send 200 response
        res.status(200).json({ message: "Indicator created" });
    };

    static editIndicators = async (req: Request, res: Response) => {

        //Get the ID from the url
        const id = req.params.id;

        let { name, description, view_name, primary_field } = req.body;

        const indicatorRepository = getRepository(QAIndicators);
        let indicator;

        try {
            indicator = await indicatorRepository.findOneOrFail(id);
        } catch (error) {
            //If not found, send a 404 response
            res.status(404).json({ message: 'Indicator not found.' });
            // throw new ErrorHandler(404, 'User not found.');
        }

        indicator.name = name;
        indicator.description = description;
        indicator.view_name = view_name;

        if(primary_field && primary_field !== " "){
            IndicatorsController.createMetaForIndicator(indicator,primary_field);
        }

        //Validade if the parameters are ok
        const errors = await validate(indicator);
        if (errors.length > 0) {
            res.status(400).json({ data: errors, message: "Error found" });
            return;
        }


        //Get indicators from database
        try {
            await indicatorRepository.save(indicator);
        } catch (e) {
            res.status(409).json({ message: "Indicator already in use" });
            return;
        }

        //If all ok, send 200 response
        res.status(200).json({ message: "Indicator updated" });
    };

    static deleteIndicators = async (req: Request, res: Response) => {
        //Get the ID from the url
        const id = req.params.id;

        const indicatorRepository = getRepository(QAIndicators);
        let indicator: QAIndicators;
        try {
            indicator = await indicatorRepository.findOneOrFail(id);
        } catch (error) {
            res.status(400).json({ message: 'Indicator not found.' });
        }
        indicatorRepository.delete(id);

        //After all send a 204 (no content, but accepted) response
        res.status(200).json({ message: "Indicator deleted sucessfully" });
    };

    static assignIndicatorToUser = async (req: Request, res: Response) => {
        let { user_id, indicator_id } = req.body;

        const userRepository = getRepository(QAUsers);
        const indicatorRepository = getRepository(QAIndicators);
        const indicatorbyUsrRepository = getRepository(QAIndicatorUser);
        // const evaluationsRepository = getRepository(QAEvaluations);

        let selectedUser, selectedIndicator = null;

        try {
            selectedUser = await userRepository.findOneOrFail(user_id);
            selectedIndicator = await indicatorRepository.findOneOrFail(indicator_id);

        } catch (error) {
            res.status(404).json({ message: "User / Indicator not found" });
            return;
        }

        let userbyIndicator = new QAIndicatorUser();
        userbyIndicator.user = selectedUser;
        userbyIndicator.indicator = selectedIndicator;

        try {
            userbyIndicator = await indicatorbyUsrRepository.save(userbyIndicator);
        } catch (e) {
            res.status(409).json({ message: "Indicator by user not saved" });
            return;
        }

        res.status(200).json({ message: "Indicator by user saved", data: userbyIndicator.id })

    }


    /*****
     * 
     * Private functions
     * 
     *****/

    static createMetaForIndicator = async (indicator: QAIndicators, primary_field: string) => {
        let pols_meta = getConnection().getMetadata(indicator.view_name).ownColumns.map(column => column.propertyName);
        let primary = primary_field;
        
        const indicatorMetaRepository = getRepository(QAIndicatorsMeta);
        
        let savePromises = [];
        for (let index = 0; index < pols_meta.length; index++) {
            const element = pols_meta[index];
            
            const indicator_meta = new QAIndicatorsMeta();
            indicator_meta.col_name = element;
            indicator_meta.display_name = element.split("_").join(" ");
            indicator_meta.enable_comments = true;
            indicator_meta.include_detail = true;
            indicator_meta.include_general = true;
            indicator_meta.indicator = indicator;
            
            indicator_meta.is_primay = (element == primary) ? true : false;
            savePromises.push(indicator_meta);
            
        }
        
        try {
            let response = await indicatorMetaRepository.save(savePromises);
            return response;
        } catch (error) {
            console.log(error);
            return false;
        }

    }



}

export default IndicatorsController;