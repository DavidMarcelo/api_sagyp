const Login = require('../models/login.model');

exports.findAll = (req, res) => {
    Login.getAll((err, data) => {
        if (err) return res.json("Error de api");

        res.json(data);
    });
};

exports.login = (req, res) =>{
    if(!req.body) res.json("Error XD");
    console.log(req.body);

    Login.login(new Login(req.body), (err, data) =>{
        if(err) return res.json(err);

        res.json(data);
    });

}