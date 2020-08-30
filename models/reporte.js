var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var reporteSchema = new Schema({
    anio: { type: Number, required: false },
    cedula: { type: String, required: false },
    clave: { type: String, required: false },
    nombre: { type: String, required: false },
    ruc: { type: String, required: false },
    totalEg: { type: Number, required: false },
    totalIng: { type: Number, required: false },
    totalRet: { type: Number, required: false },
    sueldos: { type: Number, required: false },
});
module.exports = mongoose.model('Reporte', reporteSchema);
