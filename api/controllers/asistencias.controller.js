const Asistencia = require('../models/asistencia.model');

exports.asis = (req, res) =>{
    if(!req.body) res.json("Error XD");

    console.log("Body -> ",req.body.noEmp);
    Asistencia.asis(req.body.noEmp, (err, data) => {
        if(err) return res.json(err);

        res.json(data);
    });
}