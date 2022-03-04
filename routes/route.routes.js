
module.exports = app => {
    const login = require("../controllers/login.controller");
    const asistencia = require("../models/asistencia.model");

    var router = require('express').Router();

    router.get("/", login.findAll);
    router.post("/login", login.login);

    router.get("/asistencia", asistencia.asis);

    app.use('/api', router);
}