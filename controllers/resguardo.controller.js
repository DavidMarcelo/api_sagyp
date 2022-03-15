const Resguardo = require('../models/resguardo.model');

exports.resguardo = (req, res) =>{
    if(!req.body) return res.json("No hay datos disponibles, envie el numero de empleado!");

    Resguardo.resg(req.body.noEmp, (err, data) => {
        if(err) return res.json(err);

        res.json(data);
    });
}