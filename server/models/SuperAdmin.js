const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    login: { type: String, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true, default: 'Ваше имя' },
    surname: { type: String, required: true, default: 'Ваша фамилия' },
});

module.exports = model('SuperAdmin', schema);
