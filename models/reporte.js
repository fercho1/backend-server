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
    actEmpresariales: { type: Number, required: false },
    actRelDep: { type: Number, required: false },
    apPersonal: { type: Number, required: false },
    ingRendimientos: { type: Number, required: false },
    subBImponible: { type: Number, required: false },

    gPersonales: { type: Number, required: false },
    gPersonalesPro: { type: Number, required: false },
    educacion: { type: Number, required: false },
    salud: { type: Number, required: false },
    alimentacion: { type: Number, required: false },
    vivienda: { type: Number, required: false },
    vestimenta: { type: Number, required: false },
    bimponibleGeneral: { type: Number, required: false },

    fExcedente: { type: Number, required: false },
    fBasica: { type: Number, required: false },
    iRentaC: { type: Number, required: false },
    retRelacionD: { type: Number, required: false },
    retRendimiento: { type: Number, required: false },
    creditoT: { type: Number, required: false },
    iRentaFavor: { type: Number, required: false },

});
module.exports = mongoose.model('Reporte', reporteSchema);
