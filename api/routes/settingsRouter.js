"use strict";
//created by Hatem Ragap
const express = require("express");
const router = new express.Router();
const settingsController = require('../controllers/settingsController');

router.get("/", settingsController.getAllSettings); // /api/settings/list
router.put("/parameter", settingsController.saveParameterSettings); // /api/settings/parameter
router.get("/parameter", settingsController.getParameterSettings); // /api/settings/parameter
router.put("/:type", settingsController.saveSettings); // /api/settings/settingType
router.get("/:type", settingsController.getSettings); // /api/settings/settingType

module.exports = router;
