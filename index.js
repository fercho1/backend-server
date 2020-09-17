// Requires
var express = require('express');
require('dotenv').config();
/* var mongoose = require('mongoose'); */
const { dbConnection } = require('./database/config');
var bodyParser = require('body-parser');



// Inicializar variables
var app = express();





//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
  });



//Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());



//Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var clienteRoutes = require('./routes/cliente');
var userRoutes = require('./routes/user');
var variableRoutes = require('./routes/variable');
var facturaRoutes = require('./routes/factura');
var reporteRoutes = require('./routes/reporte');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

//server index config
/* var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads')); */


//datos mongodb atlas :
//USER: fernando
//pass: GrQWqbuMFbGjFXPC

//Conexion a la base de datos 1
/* mongoose.connection.openUri('mongodb://localhost:27017/empresaDB', (err, res) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

}); */

//Conexion BD 
dbConnection();


/* app.get('/',(req,res)=>{
    res.json({
        ok:true,
        msg: 'Hola mundo'
    });
}); */


//console.log(process.env);


// Directorio público
app.use( express.static('public') );

//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/cliente', clienteRoutes);
app.use('/user', userRoutes);
app.use('/variable', variableRoutes);
app.use('/factura', facturaRoutes);
app.use('/reporte', reporteRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);



// Escuchar peticiones 1 anterior BD local
/* app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
}) */


// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log('Express server puerto :' + process.env.PORT + '\x1b[32m%s\x1b[0m', '  online');
})
