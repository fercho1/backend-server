var mongoose =	require('mongoose');
var Schema =	mongoose.Schema;


var facturaSchema =	new Schema({
    tipo: {	type: String,	required: [true,	'El	tipo	es	necesario']	},
    numFactura: {	type: String,	required: [true,	'El	numFactura	es	necesario']	},
    fecha: {	type: String,	required: false	},
    concepto: {	type: String,	required: false	},
    bImponible0: {	type: Number,	required: false	},
    bImponible: {	type: Number,	required: false	},
    iva: {	type: Number,	required: false	},
    total: {	type: Number,	required: false	},
    bImpRet: {	type: Number,	required: false	},
    cbte: {	type: String,	required: false	},
    agnt: {	type: String,	required: false	},
    retIr: {	type: Number,	required: false	},
    retIva: {	type: Number,	required: false	},
    total2: {	type: Number,	required: false	},

img: {	type: String,	required: false },
usuario: {	type: Schema.Types.ObjectId,	ref: 'Usuario',	required: true },
cliente: {	type: Schema.Types.ObjectId,	ref: 'Cliente',	required: [true,'El	id	cliente es un	campo	obligatorio']	}
});
module.exports =	mongoose.model('Factura',	facturaSchema);
