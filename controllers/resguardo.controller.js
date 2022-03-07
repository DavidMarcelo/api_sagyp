const Resguardo = require('../models/resguardo.model');

exports.resguardo = (req, res) =>{
    if(!req.body) res.send("Error XD");

    console.log("Body -> ",req.body.noEmp);
    Resguardo.resg(req.body.noEmp, (err, data) => {
        if(err) res.send(err);

        res.send(data);
    });
}