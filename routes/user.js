var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');



var app = express();

var User = require('../models/user');

// Obtener todos los clientes

app.get('/todo', (req, res, next) => {



    User.find({})
        .exec(
            (err, users) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando users',
                        errors: err
                    });
                }

                User.count({}, (err, conteo) => {


                    res.status(200).json({
                        ok: true,
                        users: users,
                        total: conteo
                    });

                })

            })
});

// ==========================================
// Obtener user por ID
// ==========================================
app.get('/:id', (req, res) => {
    var id = req.params.id;
    User.findById(id)
        .exec((err, user) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar user',
                    errors: err
                });
            }
            if (!user) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El user con el id ' + id + 'no existe',
                    errors: {
                        message: 'No existe un user con ese ID'
                    }
                });
            }
            res.status(200).json({
                ok: true,
                user: user
            });
        })
})



//Crear un nuevo cliente

app.post('/', mdAutenticacion.verificaToken, (req, res) => {



    User.remove({}, function (err) {
        if (err) {
            console.log(err)
        } else {
            res.end('success');
        }
    }
    );

    var body = req.body;


    //    console.log(body);



    body.forEach(function (entry) {
        //console.log(entry);

        var user = new User({
            anio: entry.anio,
            cedula: entry.cedula,
            clave: entry.clave,
            nombre: entry.nombre,
            ruc: entry.ruc,
            totalEg: entry.totalEg,
            totalIng: entry.totalIng,
            totalRet: entry.totalRet,


        });


        //console.log(user);

        user.save((err, userGuardado) => {


            //console.log(userGuardado);


        });



    });

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });



});


module.exports = app;
