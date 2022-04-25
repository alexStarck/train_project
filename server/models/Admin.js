const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    login: { type: String, unique: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    phoneNumber: { type: String, unique: true },
    personnelNumber: { type: String, unique: true },
    password: { type: String, required: true },
    company: { type: Types.ObjectId, ref: 'Company' }
});

module.exports = model('Admin', schema);
