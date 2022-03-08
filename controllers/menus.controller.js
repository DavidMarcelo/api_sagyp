const Menu = require('../models/menus.model');

exports.getAllMenus = (req, res) => {
    if(!req.body) res.json("Error al obtener el menu");

    console.log("Cuerpoo=",req.body);
    Menu.getMenu(new Menu(req.body),(err, data) => {
        if (err) res.status.json(err);

        res.json(data);
    });
};
