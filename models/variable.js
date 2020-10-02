var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var variableSchema = new Schema({
    varImponible: { type: Number, required: [true, 'La variable imponible	es	necesario'] },
    varIva: { type: Number, required: [true, 'La variable imponible	es	necesario'] },
    varRetIr: { type: Number, required: [true, 'La variable imponible	es	necesario'] },
    varLiq: { type: Number },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'variables' });
module.exports = mongoose.model('Variable', variableSchema);
