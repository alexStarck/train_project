const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    objectName: {type: String, required: true, unique: true},
    type: {type: String, required: true},
    composition: {type: Array, required: true},
    detail: {type: String, required: true},
    company: {type: Types.ObjectId, ref: 'Company'},
});


module.exports = model('Objects', schema);