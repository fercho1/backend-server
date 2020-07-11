var mongoose =	require('mongoose');
var Schema =	mongoose.Schema;


var facturaSchema =	new Schema({
numFactura: {	type: String,	required: [true,	'El	numFactura	es	necesario']	},
img: {	type: String,	required: false },
usuario: {	type: Schema.Types.ObjectId,	ref: 'Usuario',	required: true },
cliente: {	type: Schema.Types.ObjectId,	ref: 'Cliente',	required: [true,'El	id	cliente es un	campo	obligatorio']	}
});
module.exports =	mongoose.model('Factura',	facturaSchema);
