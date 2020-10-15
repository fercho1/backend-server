var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');



var app = express();

var Rango = require('../models/rango');

// Obtener todos los rangos

app.get('/todo', (req, res, next) => {



    Rango.find({})
        .populate('usuario', 'nombre email')
        .exec(
            (err, rangos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando rangos',
                        errors: err
                    });
                }

                Rango.count({}, (err, conteo) => {


                    res.status(200).json({
                        ok: true,
                        rangos: rangos,
                        total: conteo
                    });

                })

            })
});


// Obtener todos los rangos

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Rango.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, rangos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando rangos',
                        errors: err
                    });
                }

                Rango.count({}, (err, conteo) => {


                    res.status(200).json({
                        ok: true,
                        rangos: rangos,
                        total: conteo
                    });

                })

            })
});

// ==========================================
// Obtener rango por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Rango.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, rango) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar rango',
                    errors: err
                });
            }
            if (!rango) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El rango con el id ' + id + 'no existe',
                    errors: {
                        message: 'No existe un rango con ese ID'
                    }
                });
            }
            res.status(200).json({
                ok: true,
                rango: rango
            });
        })
})




//Actualizar un nuevo rango

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Rango.findById(id, (err, rango) => {



        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar rango',
                errors: err
            });
        }

        if (!rango) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El rango con el id ' + id + 'no existe',
                errors: { message: 'No existe un rango con ese ID' }
            });

        }

        rango.fraccionBasica = body.fraccionBasica;
        rango.excesoHasta = body.excesoHasta;
        rango.impFraccionB = body.impFraccionB;
        rango.impFraccionE = body.impFraccionE;
        rango.usuario = req.usuario._id;


        rango.save((err, rangoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar rango',
                    errors: err
                });
            }



            res.status(200).json({
                ok: true,
                rango: rangoGuardado
            });
        });
    });
});




//Crear un nuevo rango

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var rango = new Rango({
        fraccionBasica: body.fraccionBasica,
        excesoHasta: body.excesoHasta,
        impFraccionB: body.impFraccionB,
        impFraccionE: body.impFraccionE,
        usuario: req.usuario._id
    });

    rango.save((err, rangoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear rango',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            rango: rangoGuardado
        });

    });



});

//Eliminar un rango por id

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Rango.findByIdAndRemove(id, (err, rangoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar rango',
                errors: err
            });
        }

        if (!rangoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un rango con ese ID',
                errors: { message: 'No existe un rango con ese ID' }
            });
        }




        res.status(200).json({
            ok: true,
            rango: rangoBorrado
        });

    })


})

module.exports = app;
