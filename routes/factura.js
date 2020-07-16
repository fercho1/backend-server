var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');



var app = express();

var Factura = require('../models/factura');


// Obtener todos los facturas

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);


    Factura.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('cliente')
        .exec(
            (err, facturas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando facturas',
                        errors: err
                    });
                }

                Factura.count({},(err, conteo)=>{
                    
                    res.status(200).json({
                        ok: true,
                        facturas: facturas,
                        total: conteo
                    });
                })

            })
});

//Obtener medico id
app.get('/:id',(req,res)=>{
    var id = req.params.id;
    Factura.findById(id)
            .populate('usuario', 'nombre email img')
            .populate('cliente')
            .exec((err, factura)=>{
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar factura',
                        errors: err
                    });
                }
        
                if (!factura) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El factura con el id ' + id + 'no existe',
                        errors: { message: 'No existe un factura con ese ID' }
                    });
        
                }

                return res.status(200).json({
                    ok: true,
                    factura: factura
                });
            })
})




//Actualizar un nuevo usuario

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Factura.findById(id, (err, factura) => {



        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar factura',
                errors: err
            });
        }

        if (!factura) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El factura con el id ' + id + 'no existe',
                errors: { message: 'No existe un factura con ese ID' }
            });

        }

        factura.numFactura = body.numFactura;
        factura.usuario = req.usuario._id;
        factura.cliente = body.cliente;


        factura.save((err, facturaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar factura',
                    errors: err
                });
            }



            res.status(200).json({
                ok: true,
                factura: facturaGuardado
            });
        });
    });
});




//Crear un nuevo factura

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    var factura = new Factura({
        numFactura: body.numFactura,
        usuario: req.usuario._id,
        cliente: body.cliente
    });

    factura.save((err, facturaGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear factura',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            factura: facturaGuardado
        });

    });



});

//Eliminar un factura por id

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Factura.findByIdAndRemove(id, (err, facturaBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar factura',
                errors: err
            });
        }

        if (!facturaBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un factura con ese ID',
                errors: { message: 'No existe un factura con ese ID' }
            });
        }




        res.status(200).json({
            ok: true,
            factura: facturaBorrado
        });

    })


})

module.exports = app;