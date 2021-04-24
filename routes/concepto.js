var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');



var app = express();

var Concepto = require('../models/concepto');

// Obtener todos los conceptos

app.get('/todo', (req, res, next) => {



    Concepto.find({})
        .populate('usuario', 'nombre email')
        .exec(
            (err, conceptos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando conceptos',
                        errors: err
                    });
                }

                Concepto.count({}, (err, conteo) => {


                    res.status(200).json({
                        ok: true,
                        conceptos: conceptos,
                        total: conteo
                    });

                })

            })
});


// Obtener todos los conceptos

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Concepto.find({},)
        .skip(desde)
        .limit(5)        
        .exec(
            (err, conceptos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando conceptos',
                        errors: err
                    });
                }

                Concepto.count({}, (err, conteo) => {


                    res.status(200).json({
                        ok: true,
                        conceptos: conceptos,
                        total: conteo
                    });

                })

            })
});

// ==========================================
// Obtener concepto por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Concepto.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, concepto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar concepto',
                    errors: err
                });
            }
            if (!concepto) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El concepto con el id ' + id + 'no existe',
                    errors: {
                        message: 'No existe un concepto con ese ID'
                    }
                });
            }
            res.status(200).json({
                ok: true,
                concepto: concepto
            });
        })
})




//Actualizar un nuevo concepto

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Concepto.findById(id, (err, concepto) => {



        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar concepto',
                errors: err
            });
        }

        if (!concepto) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El concepto con el id ' + id + 'no existe',
                errors: { message: 'No existe un concepto con ese ID' }
            });

        }

        concepto.nombre = body.nombre;
        
        concepto.usuario = req.usuario._id;


        concepto.save((err, conceptoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar concepto',
                    errors: err
                });
            }



            res.status(200).json({
                ok: true,
                concepto: conceptoGuardado
            });
        });
    });
});




//Crear un nuevo concepto

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    //console.log(body);

    var concepto = new Concepto({
        nombre: body.nombre,
       
        usuario: req.usuario._id
    });

    

    concepto.save((err, conceptoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear concepto',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            concepto: conceptoGuardado
        });

    });



});

//Eliminar un concepto por id

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Concepto.findByIdAndRemove(id, (err, conceptoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar concepto',
                errors: err
            });
        }

        if (!conceptoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un concepto con ese ID',
                errors: { message: 'No existe un concepto con ese ID' }
            });
        }




        res.status(200).json({
            ok: true,
            concepto: conceptoBorrado
        });

    })


})

module.exports = app;
