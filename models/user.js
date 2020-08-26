var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var userSchema = new Schema({
    anio: { type: Number, required: false },
    cedula: { type: String, required: false },
    clave: { type: String, required: false },
    nombre: { type: String, required: false },
    ruc: { type: String, required: false },
    totalEg: { type: Number, required: false },
    totalIng: { type: Number, required: false },
    totalRet: { type: Number, required: false },
    
}, { collection: 'users' });



module.exports = mongoose.model('User', userSchema);
