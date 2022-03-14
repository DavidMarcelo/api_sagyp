
module.exports = app => {
    const login = require("../controllers/login.controller");
    const asistencia = require("../controllers/asistencias.controller");
    const resguardo = require("../controllers/resguardo.controller");
    const menu = require("../controllers/menus.controller");
    const servicio = require("../controllers/solicitud.controller");

    var router = require('express').Router();

    router.post("/", login.findAll);
    
    router.post("/login", login.loginController);

    router.post("/asistencia", asistencia.asis);

    router.post("/resguardo", resguardo.resguardo);

    router.post("/menu", menu.getAllMenus);
    router.post("/menu/modulo", menu.getModulos);

    router.post("/servicios/list", servicio.listService);
    router.post("/servicios/equipos", servicio.equipos);
    router.post("/servicios/create", servicio.createService);
    router.post("/servicios/create/save", servicio.saveService);

    app.use('/api', router);
}