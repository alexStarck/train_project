const { Schema, model ,Types} = require('mongoose');

const schema = new Schema({
    number:{ type: Number, required: true },
    dateIn:{ type: Date, required: true },
    pathToPdf:{ type: String },
    dateOut: { type: Date},
    data: { type: Array,required:true  },
    objectName: { type: String,required:true  },
    gps:{ type: String,required:true  },
    object:{ type: Types.ObjectId, ref: 'Objects' }
});

module.exports = model('Report', schema);