
module.exports = app => {
    const login = require("../controllers/login.controller");
    const asistencia = require("../controllers/asistencias.controller");
    const resguardo = require("../controllers/resguardo.controller");

    var router = require('express').Router();

    router.get("/", login.findAll);
    router.post("/login", login.login);

    router.get("/asistencia", asistencia.asis);

    router.get("/resguardo", resguardo.resguardo);

    app.use('/api', router);
}