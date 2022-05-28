const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: false, default: ''},
    surname: {type: String, required: false, default: ''},
});

module.exports = model('SuperAdmin', schema);
