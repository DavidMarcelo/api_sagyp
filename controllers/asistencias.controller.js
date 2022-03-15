const Asistencia = require('../models/asistencia.model');

exports.asis = (req, res) =>{
    if(!req.body.noEmp) return res.json("El numero de empleado no existe");

    Asistencia.asis(req.body.noEmp, (err, data) => {
        if(err) return res.json(err);

        res.json(data);
    });
}