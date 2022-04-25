const { Schema, model ,Types} = require('mongoose');

const schema = new Schema({
    name: { type: String, required: true },
    order: { type: Number, required: true },
    typeComposition: { type: Types.ObjectId, ref: 'typeOfElement' }
});

module.exports = model('Tasks', schema);