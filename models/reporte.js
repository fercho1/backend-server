var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var reporteSchema = new Schema({
    anio: { type: String, required: false },
    cedula: { type: Number, required: false },
    clave: { type: Number, required: false },
    nombre: { type: Number, required: false },
    ruc: { type: Number, required: false },
    totalEg: { type: Number, required: false },
    totalIng: { type: Number, required: false },
    totalRet: { type: Number, required: false },
});
module.exports = mongoose.model('Reporte', reporteSchema);
