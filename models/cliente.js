var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var clienteSchema = new Schema({
    nombre: { type: String, required: [true, 'El	nombre	es	necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'clientes' });
module.exports = mongoose.model('Cliente', clienteSchema);
