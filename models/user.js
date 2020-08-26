var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var userSchema = new Schema({
    nombre: { type: String, required: false },
    
}, { collection: 'users' });



module.exports = mongoose.model('User', userSchema);
