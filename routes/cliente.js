var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');



var app = express();

var Cliente = require('../models/cliente');

// Obtener todos los clientes

app.get('/todo', (req, res, next) => {



    Cliente.find({})
        .populate('usuario', 'nombre email')
        .exec(
            (err, clientes) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando clientes',
                        errors: err
                    });
                }

                Cliente.count({}, (err, conteo) => {


                    res.status(200).json({
                        ok: true,
                        clientes: clientes,
                        total: conteo
                    });

                })

            })
});


// Obtener todos los clientes

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Cliente.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, clientes) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando clientes',
                        errors: err
                    });
                }

                Cliente.count({}, (err, conteo) => {


                    res.status(200).json({
                        ok: true,
                        clientes: clientes,
                        total: conteo
                    });

                })

            })
});

// ==========================================
// Obtener cliente por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Cliente.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, cliente) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar cliente',
                    errors: err
                });
            }
            if (!cliente) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El cliente con el id ' + id + 'no existe',
                    errors: {
                        message: 'No existe un cliente con ese ID'
                    }
                });
            }
            res.status(200).json({
                ok: true,
                cliente: cliente
            });
        })
})




//Actualizar un nuevo cliente

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Cliente.findById(id, (err, cliente) => {



        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar cliente',
                errors: err
            });
        }

        if (!cliente) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El cliente con el id ' + id + 'no existe',
                errors: { message: 'No existe un cliente con ese ID' }
            });

        }

        cliente.nombre = body.nombre;
        cliente.cedula = body.cedula;
        cliente.ruc = body.ruc;
        cliente.clave = body.clave;
        cliente.usuario = req.usuario._id;


        cliente.save((err, clienteGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar cliente',
                    errors: err
                });
            }



            res.status(200).json({
                ok: true,
                cliente: clienteGuardado
            });
        });
    });
});




//Crear un nuevo cliente

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    //console.log(body);

    var cliente = new Cliente({
        nombre: body.nombre,
        cedula: body.cedula,
        ruc: body.ruc,
        clave: body.clave,
        usuario: req.usuario._id
    });

    cliente.save((err, clienteGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear cliente',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            cliente: clienteGuardado
        });

    });



});

//Eliminar un cliente por id

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Cliente.findByIdAndRemove(id, (err, clienteBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar cliente',
                errors: err
            });
        }

        if (!clienteBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un cliente con ese ID',
                errors: { message: 'No existe un cliente con ese ID' }
            });
        }




        res.status(200).json({
            ok: true,
            cliente: clienteBorrado
        });

    })


})

module.exports = app;
