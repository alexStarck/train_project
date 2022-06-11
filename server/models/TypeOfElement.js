const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    Class: {type: String, required: true, unique: true},
    company: {type: Types.ObjectId, ref: 'Company'}
});

module.exports = model('TypeOfElement', schema);