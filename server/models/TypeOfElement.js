const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    Class: {type: String, required: true, uppercase: true, minlength: 2, maxlength: 8},
    company: {type: Types.ObjectId, ref: 'Company'}
});

module.exports = model('TypeOfElement', schema);