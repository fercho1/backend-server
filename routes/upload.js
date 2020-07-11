var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Cliente = require('../models/cliente');
var Factura = require('../models/factura');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de coleccion validacion
    var tiposValidos = ['clientes', 'facturas', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es valida',
            errors: { message: 'Tipo de coleccion no es valida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    //Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];


    //Solo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'PNG'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones validas son: ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo perzonalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover el archivo de temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);



    });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            //Valida si id usuario es el correcto
            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }


            var pathViejo = './uploads/usuarios/' + usuario.img;

            //Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);

            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });

            })

        });
    }

    if (tipo === 'facturas') {

        Factura.findById(id, (err, factura) => {


            //Valida si id factura es el correcto
            if (!factura) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Factura no existe',
                    errors: { message: 'Factura no existe' }
                });
            }

            var pathViejo = './uploads/facturas/' + factura.img;

            //Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            factura.img = nombreArchivo;

            factura.save((err, facturaActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de factura actualizada',
                    factura: facturaActualizado
                });

            })

        });

    }

    if (tipo === 'clientes') {

        Cliente.findById(id, (err, cliente) => {


            //Valida si id cliente es el correcto
            if (!cliente) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'cliente no existe',
                    errors: { message: 'cliente no existe' }
                });
            }

            var pathViejo = './uploads/clientes/' + cliente.img;


            //Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);

            }

            cliente.img = nombreArchivo;

            cliente.save((err, clienteActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de cliente actualizada',
                    cliente: clienteActualizado
                });

            })

        });

    }
}

module.exports = app;