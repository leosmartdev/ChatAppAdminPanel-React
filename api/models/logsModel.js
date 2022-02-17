//created by Hatem Ragap
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const Joi = require('joi');

var logsSchema = mongoose.Schema({
    date: {
        type: Date,
        default: new Date()
    },
    log_time: {
        type: Number,
        default: Date.now
    },
    online_user_num: {
        type: Number,
        default: 0
    },
    register_user_num: {
        type: Number,
        default: 0
    },
    app_install_num: {
        type: Number,
        default: 0
    },
    app_download_num: {
        type: Number,
        default: 0
    },
    year: {
        type: Number,
        default: 1990
    },
    month: {
        type: Number,
        default: 1
    },
    day: {
        type: Number,
        default: 1
    },
});
logsSchema.plugin(uniqueValidator);
var logsSchemaModel = mongoose.model('logs', logsSchema);

module.exports = {
    logsSchemaModel,
}
