
module.exports = app => {
    const login = require("../controllers/login.controller");
    const asistencia = require("../controllers/asistencias.controller");
    const resguardo = require("../controllers/resguardo.controller");
    const menu = require("../controllers/menus.controller");

    var router = require('express').Router();

    router.get("/", login.findAll);
    
    router.post("/login", login.login);

    router.get("/asistencia", asistencia.asis);

    router.get("/resguardo", resguardo.resguardo);

    router.get("/menu", menu.getAllMenus);

    app.use('/api', router);
}