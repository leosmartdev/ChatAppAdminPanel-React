//created by Hatem Ragap
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Joi = require('joi');

var settingsSchema = mongoose.Schema({
    type: {
        type: String,
        max: 30,
        min: 5
    },
    settings: {
        type: Object
    }
});
settingsSchema.plugin(uniqueValidator);
var settingsSchemaModel = mongoose.model('settings', settingsSchema);

module.exports = {
    settingsSchemaModel,
}
