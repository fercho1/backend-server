var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');



var app = express();

var Reporte = require('../models/reporte');




// Obtener tod@s  reporte

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);


    Reporte.find({})
        .skip(desde)
        .limit(5)
        .exec(
            (err, reportes) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando reportes',
                        errors: err
                    });
                }

                Reporte.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        reportes: reportes,
                        total: conteo
                    });
                })

            })
});

//Obtener reporte id
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Reporte.findById(id)
        .exec((err, factura) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar reporte',
                    errors: err
                });
            }

            if (!reporte) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El reporte con el id ' + id + 'no existe',
                    errors: { message: 'No existe un reporte con ese ID' }
                });

            }

            return res.status(200).json({
                ok: true,
                reporte: reporte
            });
        })
})




//Actualizar un nuev@ reporte

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Reporte.findById(id, (err, reporte) => {



        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar reporte',
                errors: err
            });
        }

        if (!reporte) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El reporte con el id ' + id + 'no existe',
                errors: { message: 'No existe un reporte con ese ID' }
            });

        }

        reporte.anio = body.anio;
        reporte.cedula = body.cedula;
        reporte.clave = body.clave;
        reporte.nombre = body.nombre;
        reporte.ruc = body.ruc;
        reporte.totalEg = body.totalEg;
        reporte.totalIng = body.totalIng;
        reporte.totalRet = body.totalRet;
        


        reporte.save((err, reporteGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar reporte',
                    errors: err
                });
            }



            res.status(200).json({
                ok: true,
                reporte: reporteGuardado
            });
        });
    });
});




//Crear un nuev@ reporte

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var reporte = new Reporte({
        anio: body.anio,
        cedula: body.cedula,
        clave: body.clave,
        nombre: body.nombre,
        ruc: body.ruc,
        totalEg: body.totalEg,
        totalIng: body.totalIng,
        totalRet: body.totalRet,
       
        
    });

    reporte.save((err, reporteGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear reporte',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            reporte: reporteGuardado
        });

    });



});

//Eliminar  reporte por id

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Reporte.findByIdAndRemove(id, (err, reporteBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar reporte',
                errors: err
            });
        }

        if (!reporteBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un reporte con ese ID',
                errors: { message: 'No existe un reporte con ese ID' }
            });
        }




        res.status(200).json({
            ok: true,
            reporte: reporteBorrado
        });

    })


})

module.exports = app;

