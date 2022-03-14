const Menu = require('../models/menus.model');

exports.getAllMenus = (req, res) => {
    if(!req.body) return res.json("Error al obtener el menu");

    console.log("Cuerpoo=",req.body);
    Menu.getMenu(new Menu(req.body),(err, data) => {
        if (err) return res.json(err);

        res.json(data);
    });
};

exports.getModulos = (req, res) => {
    if(!req.body) return res.json("No hay datos disponibles");

    Menu.getModulo(new Menu(req.body), (err, data) => {
        if (err) return res.json(err);

        res.json(data);
    });
}