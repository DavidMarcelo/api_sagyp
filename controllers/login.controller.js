const Login = require('../models/login.model');

exports.findAll = (req, res) => {
    Login.getAll((err, data) => {
        if (err) return res.json("Error de api");

        res.json(data);
    });
};
exports.loginController = (req, res) =>{
    if(!req.body) res.json("No contiene ningun dato");
    
    Login.login(new Login(req.body), (err, data) =>{
        if(err) return res.json(err);

        res.json(data);
    });

}