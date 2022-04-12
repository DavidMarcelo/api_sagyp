const Notificacion = require('../models/notificaciones.model');
const  admin  = require('./firebase-config');

exports.pushNotification = (req, res) => {
    if(!req.body) return res.json("No contiene datos!");;
    Notificacion.send(new Notificacion(req.body), (err, data) => {
        if (err) return res.json(err);

        res.json(data);
    });
};