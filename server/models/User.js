const {Schema, model, Types} = require('mongoose');
const schema = new Schema({
    login: {type: String, unique: true},
    personnelNumber: {type: String},
    name: {type: String, required: true},
    surname: {type: String, required: true},
    company: {type: Types.ObjectId, ref: 'Company'},
    phoneNumber: {type: String},
    password: {type: String},
    reports: [{type: Types.ObjectId, ref: 'Reports'}]
});

module.exports = model('User', schema);
