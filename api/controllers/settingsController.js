"use strict";
//created by Leo
const Joi = require('joi');
const {settingsSchemaModel} = require('../models/settingsModel');

module.exports = {

    saveParameterSettings: async (req, res) => {

        const settings = await settingsSchemaModel.findOneAndUpdate({type: "parameter"}, {settings: req.body});

        if (!settings) {
            const parameterSettings = new settingsSchemaModel({
                type: 'parameter',
                settings: req.body
            });
            await parameterSettings.save();
        }
        
        res.json({
            success: true,
            message: 'Parameter Settings Updated !'
        });
    },

    saveSettings: async (req, res) => {
        if (!req.params.type) {
            return res.json({
                success: false,
                message: 'None of type parameter'
            });
        }
        const settings = await settingsSchemaModel.findOne({type: req.params.type});

        if (!settings) {
            const newSettingsSchema = new settingsSchemaModel({
                type: req.params.type,
                settings: req.body
            });
            await newSettingsSchema.save();
        }
        else {
            let newSettings = {
                ...settings.settings,
                ...req.body
            };
            await settingsSchemaModel.findOneAndUpdate({type: req.params.type}, {settings: newSettings});
        }
        
        res.json({
            success: true,
            message: 'Settings Updated !'
        });
    },

    getParameterSettings: async (req, res) => {

        const parameterSettings = await settingsSchemaModel.findOne({type: "parameter"});

        if (!parameterSettings) {
            res.status(500).json({error: true, data: "no settings found !"});
        } else {
            res.status(200).json({error: false, data: parameterSettings.settings});
        }

    },

    getSettings: async (req, res) => {
        if (!req.params.type) {
            return res.json({
                success: false,
                message: 'None of type parameter'
            });
        }
        const settings = await settingsSchemaModel.findOne({type: req.params.type});
        if (!settings) {
            res.status(500).json({error: true, data: "no settings found !"});
        } else {
            res.status(200).json({error: false, data: settings.settings});
        }

    },

    getAllSettings: async (req, res) => {

        const settings = await settingsSchemaModel.find();

        if (!settings) {
            res.status(500).json({error: true, data: "no settings found !"});
        } else {
            res.status(200).json({error: false, settings: settings});
        }

    }
    
};