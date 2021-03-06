const Solicitud = require('../models/solicitud.model');

exports.listService = (req, res) => {
    console.log("Lista de servicios solicitados");
    if(!req.body) return res.json("Variable indefinido");;
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