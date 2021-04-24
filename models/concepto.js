var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var conceptoSchema = new Schema({
    nombre: { type: String, unique:true, required: [true, 'El	nombre	es	necesario'] },    
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'conceptos' });

conceptoSchema.plugin(uniqueValidator,{message: '{PATH} debe de ser único'});

module.exports = mongoose.model('Concepto', conceptoSchema);
