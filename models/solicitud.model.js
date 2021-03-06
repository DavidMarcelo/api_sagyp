const sql = require('./connection');

const Solicitud = function(solicitud){
    this.folio = solicitud.folio;/*Consutar la misma tabla de tbpl_servicios extraen
    en el folio mayor y le suman 1 para aumentarlo*/
    this.noEmp = solicitud.noEmp;/*PARA EL ES EL SERVICIO*/
    this.cvePer = solicitud.cvePer;/*PARA EL ES EL SERVICIO*/
    //this.servicio = solicitud.servicio;/*El mensaje que se envia */
    this.noOficio = solicitud.noOficio;/** Caundo la solcitud tiene un numero numero o no lo tiene
    no obligatorio*/
    this.observaciones = solicitud.observaciones;
    this.idEquipo = solicitud.idEquipo;/**El equipo del usuario */
    this.cveUsuario = solicitud.cveUsuario; /*EL QUE CAPTURA*/
    this.cveSistema = solicitud.cveSistema;/**sistema que se elige */
    this.tipoServicio = solicitud.tipoServicio;/**ES cuando elige si es sistemas o sosporte con el 
    radio button */
    this.extension = solicitud.extension;/**no obligarotio la extension */

    /**Llamar al comentario de la tabla segun la columna */

    /**Para crear servicios en usuario, secretaria y tecnico */
    this.cveModulo = solicitud.cveModulo;
    this.cveAds = solicitud.cveAds;
};

/**PARA LA LISTAS DE USUARIOS */
const nombreCapturo = function(result, sistemas, equipos, cvePer){
    sql.query(`
        SELECT
            secamgob_db_si_rh.tblc_personal.Nombre as capturo
        FROM secamgob_db_servicios.tblp_servicios
        join secamgob_db_catalogos.tblc_usuarios
        on secamgob_db_catalogos.tblc_usuarios.CveUsuario = secamgob_db_servicios.tblp_servicios.CveUsuario
        join secamgob_db_si_rh.tblc_personal
        on secamgob_db_si_rh.tblc_personal.NoEmp = secamgob_db_catalogos.tblc_usuarios.NoEmp
        join secamgob_db_catalogos.tblc_estatus
        on secamgob_db_catalogos.tblc_estatus.Tipo = 1
        where secamgob_db_servicios.tblp_servicios.CvePer = ${cvePer}
        and secamgob_db_servicios.tblp_servicios.Estatus = 1
        or secamgob_db_servicios.tblp_servicios.CvePer = ${cvePer}
        and secamgob_db_servicios.tblp_servicios.Estatus = 2
        group by secamgob_db_servicios.tblp_servicios.IdServicio
        order by secamgob_db_servicios.tblp_servicios.IdServicio desc
    `, (err, res) =>{

        if(err){
            let error = {
                msg: "Error la clave no coincide",
                err: err
            }
            result(error, null);
        }else{
            nombreSolicito(result, sistemas, equipos, cvePer, res);
        }
    });
}

const nombreSolicito = function(result, sistemas, equipos, cvePer, capturo){
    sql.query(`
        SELECT
            secamgob_db_si_rh.tblc_personal.Nombre as solicito
        FROM secamgob_db_servicios.tblp_servicios
        join secamgob_db_si_rh.tblc_personal
        on secamgob_db_si_rh.tblc_personal.NoEmp = secamgob_db_servicios.tblp_servicios.NoEmp
        join secamgob_db_catalogos.tblc_estatus
        on secamgob_db_catalogos.tblc_estatus.Tipo = 1
        where secamgob_db_servicios.tblp_servicios.CvePer = ${cvePer}
        and secamgob_db_servicios.tblp_servicios.Estatus = 1
        or secamgob_db_servicios.tblp_servicios.CvePer = ${cvePer}
        and secamgob_db_servicios.tblp_servicios.Estatus = 2
        group by secamgob_db_servicios.tblp_servicios.IdServicio
        order by secamgob_db_servicios.tblp_servicios.IdServicio desc
    `, (err, res) =>{

        if(err){
            let error = {
                msg: "Error la clave no coincide",
                err: err
            }
            result(error, null);
        }else{
            nombreAtendedor(result, sistemas, equipos, cvePer, capturo, res);
        }
    });
}

const nombreAtendedor = function(result, sistemas, equipos, cvePer, capturo, solicito){
    console.log("Atendedor");
    sql.query(`
        SELECT
            secamgob_db_si_rh.tblc_personal.Nombre as atendio
        FROM secamgob_db_servicios.tblp_servicios
        join secamgob_db_si_rh.tblc_personal
        on secamgob_db_si_rh.tblc_personal.NoEmp = secamgob_db_servicios.tblp_servicios.Atendio
        join secamgob_db_catalogos.tblc_estatus
        on secamgob_db_catalogos.tblc_estatus.Tipo = 1
        where secamgob_db_servicios.tblp_servicios.CvePer = ${cvePer}
        and secamgob_db_servicios.tblp_servicios.Estatus = 1
        or secamgob_db_servicios.tblp_servicios.CvePer = ${cvePer}
        and secamgob_db_servicios.tblp_servicios.Estatus = 2
        group by secamgob_db_servicios.tblp_servicios.IdServicio
        order by secamgob_db_servicios.tblp_servicios.IdServicio desc
    `,(err, res)=>{
        if(err) result(err, null);

        if(res.length == 0){
            console.log("error");
            //result("Error de numero de empleado (No coincide con el que atend??o).", null);
            console.log(sistemas.length+equipos.length);
            let data = {
                sistema: sistemas,
                equipo:  equipos,
                solicito: solicito,
                capturo: capturo,
                atendio: res
            }
            result(null, data);
        }else{
            let data = {
                sistema: sistemas,
                equipo:  equipos,
                solicito: solicito,
                capturo: capturo,
                atendio: res
            }
            result(null, data);
        }
    });
}

const consultaEquipos =  function(cvePer, result){
    console.log("Consulta equipos");
    sql.query(`
        SELECT 
        secamgob_db_servicios.tblp_servicios.IdEquipo,
        secamgob_db_servicios.tblp_servicios.CveUsuario,
        secamgob_db_servicios.tblp_servicios.Atendio,
        secamgob_db_servicios.tblp_servicios.CveSistema,
        secamgob_db_servicios.tblp_servicios.Folio,
        secamgob_db_servicios.tblp_servicios.FecCap,
        secamgob_db_servicios.tblp_servicios.TipoServ,
        secamgob_db_catalogos.tblc_tipoequipo.DesTipEqp
        FROM secamgob_db_servicios.tblp_servicios
        join secamgob_db_bienesinformaticos.tblp_equipos
        on secamgob_db_bienesinformaticos.tblp_equipos.IdEquipo = secamgob_db_servicios.tblp_servicios.IdEquipo
        join secamgob_db_catalogos.tblc_tipoequipo
        on secamgob_db_catalogos.tblc_tipoequipo.CveTipEqp = secamgob_db_bienesinformaticos.tblp_equipos.CveTipEqp
        join secamgob_db_catalogos.tblc_estatus
        on secamgob_db_catalogos.tblc_estatus.Tipo = 1 
        where secamgob_db_servicios.tblp_servicios.CvePer = ${cvePer}
        and secamgob_db_servicios.tblp_servicios.Estatus = 1
        or secamgob_db_servicios.tblp_servicios.CvePer = ${cvePer}
        and secamgob_db_servicios.tblp_servicios.Estatus = 2
        group by secamgob_db_servicios.tblp_servicios.IdServicio
        order by secamgob_db_servicios.tblp_servicios.IdServicio desc
    `, (err, res) =>{
        if(err) result(err, null);

        //result(null, res);
        //nombreAtendedor(result, res[0].CveUsuario, res);
        if(res.length == 0){
            console.log("Cero Equipos");
            consultaSistemas(cvePer, result, res)
        }else{
            console.log("Con Equipos");
            consultaSistemas(cvePer, result, res)
        }
    });
}

const consultaSistemas =  function(cvePer, result, equipos){
    console.log("Consulta sistemas");
    sql.query(`
        SELECT 
        secamgob_db_servicios.tblp_servicios.IdEquipo,
        secamgob_db_servicios.tblp_servicios.CveUsuario,
        secamgob_db_servicios.tblp_servicios.Atendio,
        secamgob_db_servicios.tblp_servicios.CveSistema,
        secamgob_db_servicios.tblp_servicios.Folio,
        secamgob_db_servicios.tblp_servicios.FecCap,
        secamgob_db_servicios.tblp_servicios.TipoServ,
        secamgob_db_catalogos.tblc_sistemas.Sistema
        FROM secamgob_db_servicios.tblp_servicios
        join secamgob_db_catalogos.tblc_sistemas
        on secamgob_db_catalogos.tblc_sistemas.CveSistema = secamgob_db_servicios.tblp_servicios.CveSistema
        join secamgob_db_catalogos.tblc_estatus
        on secamgob_db_catalogos.tblc_estatus.Tipo = 1 
        where secamgob_db_servicios.tblp_servicios.CvePer = ${cvePer}
        and secamgob_db_servicios.tblp_servicios.Estatus = 1
        or secamgob_db_servicios.tblp_servicios.CvePer = ${cvePer}
        and secamgob_db_servicios.tblp_servicios.Estatus = 2
        group by secamgob_db_servicios.tblp_servicios.IdServicio
        order by secamgob_db_servicios.tblp_servicios.IdServicio desc
    `, (err, res) =>{
        if(err) result(err, null);

        //result(null, res);
        if(res.length == 0){
            console.log("Cero sistemas");
            let error = {
                msg: "No tienes servicios pendientes"
            }
            result(error, null);
            //nombreCapturo(result, res, equipos, cvePer);
        }else{
            console.log("Con Sistemas");
            nombreCapturo(result, res, equipos, cvePer);
        }
        //nombreCapturo(result, res[0].CveUsuario, res, equipos);
    });
}

Solicitud.list = (cvePer, result) => {
    consultaEquipos(cvePer, result);
}

const equiposDelUsuario =  function(result,  solicitud, noEmp){
    console.log("Equipos de resguardo");
    sql.query(`
        SELECT 
            secamgob_db_bienesinformaticos.tblp_equipos.IdEquipo,
            secamgob_db_bienesinformaticos.tblp_equipos.CveTipEqp,
            secamgob_db_catalogos.tblc_tipoequipo.DesTipEqp
        FROM secamgob_db_bienesinformaticos.tblp_equipos 
        INNER JOIN secamgob_db_catalogos.tblc_tipoequipo 
        ON secamgob_db_bienesinformaticos.tblp_equipos.CveTipEqp = secamgob_db_catalogos.tblc_tipoequipo.CveTipEqp
        INNER JOIN secamgob_db_si_rh.tblc_personal
        ON secamgob_db_bienesinformaticos.tblp_equipos.NoEmp = secamgob_db_si_rh.tblc_personal.NoEmp
        INNER JOIN secamgob_db_catalogos.tblc_marcasequipos
        ON secamgob_db_bienesinformaticos.tblp_equipos.CveMarEqp = secamgob_db_catalogos.tblc_marcasequipos.CveMarEqp
        WHERE secamgob_db_bienesinformaticos.tblp_equipos.NoEmp = ${noEmp}
    `, (err, res) => {
        if(err) result(err, null);

        let data = {
            solicitud: solicitud,
            equipos: res
        }
        result(null, data);
    });
    
}

const usuariosDebajo = function(result, sistemas, solicitud, tipo){
    console.log("Usuarios debajo de las secretarias: "+tipo);
    if(tipo == "Tecnico"){
        sql.query(`
            SELECT 
                secamgob_db_si_rh.tblc_personal.NoEmp,
                secamgob_db_si_rh.tblc_personal.Nombre
            FROM secamgob_db_si_rh.tblc_personal;
        `, (err, res)=> {
            if(err) result(err, null);

            let data = {
                usuarios: res,
                sistemas: sistemas
            }
            equiposDelUsuario(result, data, solicitud.noEmp);
            //result(null, data);
        });

    }else if(tipo=="Secretaria"){
        sql.query(`
            SELECT
            secamgob_db_si_rh.tblc_personal.Nombre,
            secamgob_db_si_rh.tblc_personal.NoEmp
            FROM
            secamgob_db_si_rh.tblc_personal
            LEFT JOIN secamgob_db_si_rh.tblc_adscricion ON secamgob_db_si_rh.tblc_personal.CveAds = secamgob_db_si_rh.tblc_adscricion.CveAds
            WHERE
            secamgob_db_si_rh.tblc_adscricion.CveAds  = ${solicitud.cveAds}
        `, (err, res)=> {
            if(err) result(err, null);

            let data = {
                usuarios: res,
                sistemas: sistemas
            }
            equiposDelUsuario(result, data, solicitud.noEmp);
            //result(null, data);
        });
    }
}

const todosLosSistemas =  function(result, tipo, solicitud){
    console.log("Todos los sistemas",tipo);
    sql.query(`
        SELECT 
            secamgob_db_catalogos.tblc_sistemas.CveSistema,
            secamgob_db_catalogos.tblc_sistemas.Sistema
        FROM secamgob_db_catalogos.tblc_sistemas;
    `, (err, res)=>{
        if(err) result(err, null);

        if(tipo == "Tecnico"){
            usuariosDebajo(result, res, solicitud, tipo);
        }else if(tipo == "Secretaria"){
            usuariosDebajo(result, res, solicitud, tipo);
        }else{
            equiposDelUsuario(result, res, solicitud.noEmp);
        }
    });
}

Solicitud.save = (solicitud, result) => {
    console.log("Guardar inicio");
    sql.query(`
        SELECT Folio FROM
        secamgob_db_servicios.tblp_servicios
        order by secamgob_db_servicios.tblp_servicios.Folio desc
    `,
    (err, res)=>{
        if(err) result(err, null);

        let folio = res[0].Folio+1;
        
        if(solicitud.cveSistema > 0 && solicitud.idEquipo == 0){
            console.log("SISTEMA");
            solicitud.tipoServicio = "SISTEMA";
        }else if(solicitud.cveSistema == 0 && solicitud.idEquipo > 0){
            console.log("SOPORTE");
            solicitud.tipoServicio = "SOPORTE";
        }
        let fecha = new Date().toString().replace(/T/, ':').replace(/\.\w*/, '');
        sql.query(`
            INSERT INTO secamgob_db_servicios.tblp_servicios
            (
                secamgob_db_servicios.tblp_servicios.FecCap,
                secamgob_db_servicios.tblp_servicios.Folio,
                secamgob_db_servicios.tblp_servicios.NoEmp,
                secamgob_db_servicios.tblp_servicios.CvePer,
                secamgob_db_servicios.tblp_servicios.IdEquipo,
                secamgob_db_servicios.tblp_servicios.CveUsuario,
                secamgob_db_servicios.tblp_servicios.CveSistema,
                secamgob_db_servicios.tblp_servicios.Extension,
                secamgob_db_servicios.tblp_servicios.Observaciones,
                secamgob_db_servicios.tblp_servicios.TipoServ,
                secamgob_db_servicios.tblp_servicios.NoOficio,
                secamgob_db_servicios.tblp_servicios.Estatus
            )
            VALUE 
            (
                "${fecha}",
                "${folio}",
                "${solicitud.noEmp}",
                "${solicitud.cvePer}",
                "${solicitud.idEquipo}",
                "${solicitud.cveUsuario}",
                "${solicitud.cveSistema}",
                "${solicitud.extension}",
                "${solicitud.observaciones}",
                "${solicitud.tipoServicio}",
                "${solicitud.noOficio}",
                "${1}"
            )
        `, (err, res) => {
            if(err) result(err, null);

            result(null, "Servicio agregado, exitosamente!")
        });
    });
}

Solicitud.EquipoUsuario = (solicitud, result)  => {
    equiposDelUsuario(result, solicitud, solicitud.noEmp);
}

Solicitud.create = (solicitud, result) => {
    console.log("Crear: ",solicitud);

    if(solicitud.cveModulo == undefined || solicitud.cveSistema == undefined || solicitud.cveUsuario == undefined){
        let error = {
            msg: "Error los datos no son correcto o se encuentra vacios!"
        }
        result(error, null);
    }
    sql.query(`
        SELECT
            secamgob_db_catalogos.tblp_herencias.CveHerencia,
            secamgob_db_catalogos.tblp_herencias.CvePrivilegio,
            secamgob_db_catalogos.tblc_privilegios.Privilegio
        FROM secamgob_db_catalogos.tblp_herencias
        LEFT JOIN secamgob_db_catalogos.tblc_privilegios 
        ON secamgob_db_catalogos.tblp_herencias.CvePrivilegio = secamgob_db_catalogos.tblc_privilegios.CvePrivilegio
        WHERE
        secamgob_db_catalogos.tblp_herencias.CveUsuario = ${solicitud.cveUsuario} AND
        secamgob_db_catalogos.tblp_herencias.CveSistema = ${solicitud.cveSistema} AND
        secamgob_db_catalogos.tblp_herencias.CveModulo = ${solicitud.cveModulo}
        ORDER BY
        secamgob_db_catalogos.tblc_privilegios.Privilegio ASC
    `, (err, res) => {
        if(err) {
            result(err, null);
        }else{
            if(res.length==0){
                let error ={
                    msg: "No tienes los permisos suficientes para acceder!"
                }
                result(error, null);
            }else{
                console.log(res[res.length-1].Privilegio);
                if(res[res.length-1].Privilegio == "Tecnico"){
                    //Secretaria de secretarias
                    //result(null, res);
                    todosLosSistemas(result, res[res.length-1].Privilegio, solicitud);
                }else if(res[res.length-1].Privilegio == "Secretaria"){
                    //Secretarias
                    todosLosSistemas(result, res[res.length-1].Privilegio, solicitud);
                    //result(null, "Secretaria normal");
                }else{
                    //Usuarios normales
                    todosLosSistemas(result, res[res.length-1].Privilegio, solicitud);
                    //result(null, "normal");
                }
            }
            
        }
        
    });
}

module.exports = Solicitud;