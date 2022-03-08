const Login = require('../models/login.model');

exports.findAll = (req, res) => {
    Login.getAll((err, data) => {
        if (err) res.status.json(err);

        res.json(data);
    });
};

exports.login = (req, res) =>{
    if(!req.body) res.json("Error XD");
    console.log(req.body);
    Login.login(new Login(req.body), (err, data) =>{
        if(err) res.status.json(err);

        
        /*req.session.sessionLogin = {
            session: true,
            name: req.body.noEmp,
            clave: req.body.clave
        }*/
        res.json(data);
    });

}