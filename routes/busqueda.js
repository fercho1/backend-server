var express = require('express');

var app = express();

var Cliente = require('../models/cliente');
var Factura = require('../models/factura');
var Usuario = require('../models/usuario');
var Concepto = require('../models/concepto');

//Busqueda por coleccion
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'facturas':
            promesa = buscarFacturas(busqueda, regex);
            break;

        case 'clientes':
            promesa = buscarClientes(busqueda, regex);
            break;
        
        case 'conceptos':
            promesa = buscarConceptos(busqueda, regex);
            break;

        default:
            res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda solo son: Usuarios, Clientes y Facturas',
                error: {message: 'Tipo de tabla/coleccion novalido'}
            });
    }

    promesa.then(data=>{

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })


});


//Busqueda general

app.get('/todo/:busqueda', (req, res, next) => {


    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    Promise.all([
        buscarClientes(busqueda, regex),
        buscarFacturas(busqueda, regex),
        buscarUsuarios(busqueda, regex),
        buscarConceptos(busqueda, regex)

    ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                clientes: respuestas[0],
                facturas: respuestas[1],
                usuarios: respuestas[2],
                conceptos: respuestas[3]
            });
        })




});

function buscarClientes(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Cliente.find({ nombre: regex })
            .populate('usuario', 'nombre email img')
            .exec((err, clientes) => {

                if (err) {
                    reject('Error al cargar Cliente busqueda', err);
                } else {
                    resolve(clientes)
                }
            });
    });
}

function buscarFacturas(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Factura.find({ numFactura: regex })
            .populate('usuario', 'nombre email img')
            .populate('cliente')
            .exec((err, facturas) => {

                if (err) {
                    reject('Error al cargar Factura busqueda', err);
                } else {
                    resolve(facturas)
                }
            });
    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role img')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al buscar usuarios', err);
                } else {
                    resolve(usuarios);
                }

            })

    });
}

function buscarConceptos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Concepto.find({}, 'nombre')
            .or([{ 'nombre': regex }])
            .exec((err, conceptos) => {

                if (err) {
                    reject('Error al buscar conceptos', err);
                } else {
                    resolve(conceptos);
                }

            })

    });
}

module.exports = app;