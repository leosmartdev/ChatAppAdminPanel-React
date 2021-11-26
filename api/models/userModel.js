//created by Hatem Ragap
var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
// const Joi = require('joi');

const userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        max: 50,
        min: 5
    },
    username: String,
    token: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        required: true
    },
    originPassword: {
        type: String
    },
    gender: {
        type: Number,
        default: 0  // male: 0, female: 1, business: 2
    },
    role: {
        type: String,
        default: 'user'
    },
    avatarUrl: {
        type: String,
        default: 'default-user-profile-image.png'
    },
    coverage: {
        type: Number,
        default: 50
    },
    like: {
        type: Number,
        default: 0
    },
    dislike: {
        type: Number,
        default: 0
    },
    likeUsers: {
        type: Array,
        default: []
    },
    dislikeUsers: {
        type: Array,
        default: []
    },
    balance: {
        type: Number,
        default: 0
    },
    balanceCurrency: {
        type: String,
        default: 'USD'
    },
    punishment: {
        type: Number,
        default: 0
    },
    img: {
        type: String,
        default: 'default-user-profile-image.png'
    },
    bio: {
        type: String,
        default: 'Hi iam using V Chat App'
    },
    phoneNumber: String,
    address: String,
    zipCode: String,
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0,0]
        }
    },
    country: {
        type: String,
        default: ''
    },
    state: String,
    city: String,
    status: {
        type: String,
        default: 'active'
    },
    chatstatus: {
        type: String,
        default: 'online'
    },
    online: {
        type: Boolean,
        default: false
    },
    fixedLocation: String,
    note: {
        type: String
    },
    created: {
        type: Date,
        default: new Date()
    },
    use_current_location_as_permanent: {
        type: Boolean,
        default: false
    },
    display_position_with_random_offset: {
        type: Boolean,
        default: false
    },
    all_new_message_alert: {
        type: Boolean,
        default: false
    },
    public_chat_room_me_alert: {
        type: Boolean,
        default: false
    },
    change_kilometers_to_miles: {
        type: Boolean,
        default: false
    },
    voice_alert: {
        type: Boolean,
        default: false
    },
    vibration_alert: {
        type: Boolean,
        default: false
    },
    do_not_disturb: {
        type: Boolean,
        default: false
    }
});
userSchema.index({ location: '2dsphere'});
userSchema.plugin(uniqueValidator);
var userSchemaModel = mongoose.model('users', userSchema);

module.exports = {
    userSchemaModel,
}
