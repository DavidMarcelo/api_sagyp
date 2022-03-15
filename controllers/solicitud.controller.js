const Solicitud = require('../models/solicitud.model');

exports.listService = (req, res) => {
    if(!req.body) return res.json("No contiene datos!");;
    Solicitud.list(req.body.cvePer, (err, data) => {
        if (err) return res.json(err);

        res.json(data);
    });
};

exports.createService = (req, res) =>{
    if(!req.body) return res.json("Variable indefinida");

    Solicitud.create(new Solicitud(req.body), (err, data) =>{
        if(err) return res.json(err);

        res.json(data);
    });

}

exports.saveService = (req, res) =>{
    if(!req.body) return res.json("Variable indefinida");

    Solicitud.save(new Solicitud(req.body), (err, data) =>{
        if(err) return res.json(err);

        res.json(data);
    });    
}

exports.equipos = (req, res) => {
    if(!req.body) return res.json("Error, envio de variables");

    Solicitud.EquipoUsuario(new Solicitud(req.body), (err, data) =>{
        if(err) return res.json(err);

        res.json(data);
    });
}