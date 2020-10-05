var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');



var app = express();

var Factura = require('../models/factura');

// Obtener todos los clientes

app.get('/todo', (req, res, next) => {



    Factura.find({})
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

                Factura.count({}, (err, conteo) => {


                    res.status(200).json({
                        ok: true,
                        facturas: facturas,
                        total: conteo
                    });

                })

            })
});


// Obtener las facturas agrupadas

app.get('/group', (req, res, next) => {




    Factura.aggregate([
        {
            $group: {
                _id: {
                    cliente: "$cliente",
                    tipo: "$tipo",
                    mes: { $month: "$fecha" },
                    anio: { $year: "$fecha" }
                },
                totalbImponible0: { $sum: "$bImponible0" },
                totalbImponible: { $sum: "$bImponible" },
                totalIva: { $sum: "$iva" },
                total: { $sum: "$total" },
                
                totalretIr: { $sum: "$retIr" },
                totalretIva: { $sum: "$retIva" },
                total2: { $sum: "$total2" },
                count: { $sum: 1 }
            }
        },
        { $lookup: { from: 'clientes', localField: '_id.cliente', foreignField: '_id', as: 'cliente' } }
    ])
        .exec(
            (err, facturas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando facturas',
                        errors: err
                    });
                }

                Factura.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        facturas: facturas,
                        total: facturas.length
                    });
                })

            })
});

// Obtener las facturas agrupadas test

app.get('/group1', (req, res, next) => {

    Factura.find({})
        .populate('usuario', 'nombre email')
        .populate('cliente')
        .exec(
            (err, facturas1) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando facturas',
                        errors: err
                    });
                }

                Factura.count({}, (err, conteo) => {

                    let facturas = facturas1.map(item => {

                        
                        
                        return {
                            _id: item._id,
                            tipo: item.tipo,
                            numFactura: item.numFactura,
                            fecha: item.fecha,
                            mes: item.fecha.getMonth() + 1,
                            anio: item.fecha.getFullYear(),
                            concepto: item.concepto,
                            bImponible0: item.bImponible0,
                            bImponible: item.bImponible,
                            iva: item.iva,
                            total: item.total,
                            
                            cbte: item.cbte,
                            agnt: item.agnt,
                            retIr: item.retIr,
                            retIva: item.retIva,
                            total2: item.total2,
                            cliente: item.cliente,


                        }
                    });

                    res.status(200).json({
                        ok: true,
                        facturas: facturas,
                        total: conteo
                    });

                })

            })




});

// Obtener las facturas agrupadas ingresos , egresos y retención

app.get('/groups', (req, res, next) => {




    Factura.aggregate([
        {
            $group: {
                _id: {
                    cliente: "$cliente",
                    tipo: "$tipo",
                    mes: { $month: "$fecha" },
                    anio: { $year: "$fecha" }
                },
                totalbImponible0: { $sum: "$bImponible0" },
                totalbImponible: { $sum: "$bImponible" },
                totalIva: { $sum: "$iva" },
                total: { $sum: "$total" },
                
                totalretIr: { $sum: "$retIr" },
                totalretIva: { $sum: "$retIva" },
                total2: { $sum: "$total2" },
                count: { $sum: 1 }
            }
        },
        { $lookup: { from: 'clientes', localField: '_id.cliente', foreignField: '_id', as: 'cliente' } },
        {
            $group: {
                _id: {
                    cliente: "$_id.cliente",
                    anio: "$_id.anio",
                    mes: "$_id.mes"

                },


                grupo: {
                    $push: {
                        cliente: "$_id.cliente",
                        tipo: "$_id.tipo",
                        anio: "$_id.anio",
                        mes: "$_id.mes",
                        totalbImponible: "$totalbImponible",
                        totalbImponible0: "$totalbImponible0",
                        totalretIr: "$totalretIr",
                        count: "$count"
                    }
                }
            }
        },
        { $lookup: { from: 'clientes', localField: '_id.cliente', foreignField: '_id', as: 'cliente' } }
    ])
        .exec(
            (err, facturas) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando facturas',
                        errors: err
                    });
                }

                Factura.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        facturas: facturas,
                        total: conteo
                    });
                })

            })
});



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

                Factura.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        facturas: facturas,
                        total: conteo
                    });
                })

            })
});

//Obtener factura id
app.get('/:id', (req, res) => {
    var id = req.params.id;
    Factura.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('cliente')
        .exec((err, factura) => {
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

        factura.tipo = body.tipo;
        factura.numFactura = body.numFactura;
        factura.fecha = body.fecha;
        factura.concepto = body.concepto;
        factura.bImponible0 = body.bImponible0;
        factura.bImponible = body.bImponible;
        factura.iva = body.iva;
        factura.total = body.total;
        
        factura.cbte = body.cbte;
        factura.agnt = body.agnt;
        factura.retIr = body.retIr;
        factura.retIva = body.retIva;
        factura.total2 = body.total2;

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
        tipo: body.tipo,
        numFactura: body.numFactura,
        fecha: body.fecha,
        concepto: body.concepto,
        bImponible0: body.bImponible0,
        bImponible: body.bImponible,
        iva: body.iva,
        total: body.total,
        
        cbte: body.cbte,
        agnt: body.agnt,
        retIr: body.retIr,
        retIva: body.retIva,
        total2: body.total2,

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

