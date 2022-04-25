const { Schema, model ,Types} = require('mongoose');

const schema = new Schema({
    path:{ type: String, required: true },
    report:{ type: Types.ObjectId, ref: 'Report' }
});

module.exports = model('Images', schema);