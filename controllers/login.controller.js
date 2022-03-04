const Login = require('../models/login.model');

exports.findAll = (req, res) => {
    Login.getAll((err, data) => {
        if (err) res.status.send(err);

        res.send(data);
    });
};

exports.login = (req, res) =>{
    if(!req.body) res.send("Error XD");
    console.log(req.body);
    //res.send(req.body);
    Login.login(new Login(req.body), (err, data) =>{
        if(err) res.send(err);

        res.send(data);
    });

}

exports.asis = (req, res) =>{
    if(!req.body) res.send("Error XD");

    console.log("Body -> ",req.body.noEmp);
    Login.asis(req.body.noEmp, (err, data) => {
        if(err) res.send(err);

        res.send(data);
    });
}