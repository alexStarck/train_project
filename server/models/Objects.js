const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
    objectName: {type: String, required: true, unique: true},
    company: {type: Types.ObjectId, ref: 'Company'},
    type: {type: String, required: true},
    composition: {type: Array, required: true},
    detail: {type: String, required: true}
});


module.exports = model('Objects', schema);