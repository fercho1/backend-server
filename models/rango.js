var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;
var rangoSchema = new Schema({
    fraccionBasica: { type: Number, required: false },
    excesoHasta: { type: Number, required: false },
    impFraccionB: { type: Number, required: false },    
    impFraccionE: { type: Number, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }    
}, { collection: 'rangos' });

rangoSchema.plugin(uniqueValidator,{message: '{PATH} debe de ser unico'});

module.exports = mongoose.model('Rango', rangoSchema);
