const Resguardo = require('../models/resguardo.model');

exports.resguardo = (req, res) =>{
    if(!req.body) return res.json("Error de parametros!");

    Resguardo.resg(req.body.noEmp, (err, data) => {
        if(err) return res.json(err);

        res.json(data);
    });
}