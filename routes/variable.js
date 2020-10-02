var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');



var app = express();

var Variable = require('../models/variable');


// Obtener todos los variables

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Variable.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            (err, variables) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando variables',
                        errors: err
                    });
                }

                Variable.count({}, (err, conteo) => {


                    res.status(200).json({
                        ok: true,
                        variables: variables,
                        total: conteo
                    });

                })

            })
});

// ==========================================
// Obtener variable por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Variable.findById(id)
        .populate('usuario', 'nombre img email')
        .exec((err, variable) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar variable',
                    errors: err
                });
            }
            if (!variable) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El variable con el id ' + id + 'no existe',
                    errors: {
                        message: 'No existe un variable con ese ID'
                    }
                });
            }
            res.status(200).json({
                ok: true,
                variable: variable
            });
        })
})




//Actualizar un nuevo variable

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Variable.findById(id, (err, variable) => {



        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar variable',
                errors: err
            });
        }

        if (!variable) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El variable con el id ' + id + 'no existe',
                errors: { message: 'No existe un variable con ese ID' }
            });

        }

        variable.varImponible = body.varImponible;
        variable.varIva = body.varIva;
        variable.varRetIr = body.varRetIr;
        variable.varLiq = body.varLiq;
        
        variable.usuario = req.usuario._id;


        variable.save((err, variableGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar variable',
                    errors: err
                });
            }



            res.status(200).json({
                ok: true,
                variable: variableGuardado
            });
        });
    });
});




//Crear un nuevo variable

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var variable = new Variable({
        varImponible: body.varImponible,
        varIva: body.varIva,
        varRetIr: body.varRetIr,
        varLiq: body.varLiq,
        
        usuario: req.usuario._id
    });

    variable.save((err, variableGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear variable',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            variable: variableGuardado
        });

    });



});

//Eliminar un variable por id

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Variable.findByIdAndRemove(id, (err, variableBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar variable',
                errors: err
            });
        }

        if (!variableBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un variable con ese ID',
                errors: { message: 'No existe un variable con ese ID' }
            });
        }




        res.status(200).json({
            ok: true,
            variable: variableBorrado
        });

    })


})

module.exports = app;
