const { Schema, model } = require('mongoose');

const schema = new Schema({
    Class: { type: String, required: true, unique: true }
});

module.exports = model('TypeOfElement', schema);