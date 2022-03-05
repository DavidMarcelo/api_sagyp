const Asistencia = require('../models/login.model');

exports.asis = (req, res) =>{
    if(!req.body) res.send("Error XD");

    console.log("Body -> ",req.body.noEmp);
    Asistencia.asis(req.body.noEmp, (err, data) => {
        if(err) res.send(err);

        res.send(data);
    });
}