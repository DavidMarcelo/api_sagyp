
module.exports = app => {
    const login = require("../controllers/login.controller");
    const asistencia = require("../controllers/asistencias.controller");
    const resguardo = require("../controllers/resguardo.controller");
    const menu = require("../controllers/menus.controller");
    const servicio = require("../controllers/solicitud.controller");

    var router = require('express').Router();

    router.post("/", login.findAll);
    
    //Completado
    /**
     * Devuelve los registros de la persona como de los sistemas a los que pertenece! */ 
    router.post("/login", login.loginController);

    /**Devuelve solo las faltas o retardos de las personas*/
    router.post("/asistencia", asistencia.asis);

    /**Obtiene los equipos de la persona que se esta logeando*/
    router.post("/resguardo", resguardo.resguardo);

    /**Una vez que el usuario se logueo automaticamente vienen todos los sistemas (menú) a los que pertenece
     * para poder saber a que modulos tenemos accesos nos dirigimos a menú
     */
    router.post("/menu", menu.getAllMenus);/**Obtenemos los modulos al cual tenemos acceso unicamente */
    router.post("/menu/modulo", menu.getModulos);/**Obtenemos lo servicios que ofrece el modulo y a los cuales el usuario tiene acceso*/

    /**Servicio que se encuentra el menú de SISTEMA DE SERVICIOS EN LINEA*/
    router.post("/servicios/list", servicio.listService);/**Listado de los servicios que se encuentren pendiente o
    se acaben de realizar */
    router.post("/servicios/create", servicio.createService);/**Para crear un nuevo servicio obtenemos todos los sistemas y 
    los equipos de resguardo del usuario*/
    router.post("/servicios/equipos", servicio.equipos);
    router.post("/servicios/create/save", servicio.saveService);

    app.use('/api', router);
}