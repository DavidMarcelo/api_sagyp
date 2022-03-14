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
};

const nombreAtendedor = function(result, cveUsuario, servicio){
    sql.query(`
        SELECT
        Nombre
        FROM secamgob_db_si_rh.tblc_personal
        WHERE secamgob_db_si_rh.tblc_personal.NoEmp = ${cveUsuario}
    `,(err, res)=>{
        if(err) result(err, null);

        if(res.length == 0){
            console.log("error");
            //result("Error de numero de empleado (No coincide con el que atendío).", null);
            let data = {
                msg: "El numero de emplado no coincide!"
            }
            result(err, null);
        }else{
            let data = {
                servicio: servicio,
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
        secamgob_db_catalogos.tblc_estatus.DesEst,
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
        nombreAtendedor(result, res[0].CveUsuario, res);
    });
}

const consultaSistemas =  function(cvePer, result){
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
        secamgob_db_catalogos.tblc_estatus.DesEst,
        secamgob_db_si_rh.tblc_personal.Nombre,
        secamgob_db_catalogos.tblc_sistemas.Sistema
        FROM secamgob_db_servicios.tblp_servicios
        join secamgob_db_catalogos.tblc_sistemas
        on secamgob_db_catalogos.tblc_sistemas.CveSistema = secamgob_db_servicios.tblp_servicios.CveSistema
        join secamgob_db_si_rh.tblc_personal
        on secamgob_db_si_rh.tblc_personal.NoEmp = secamgob_db_servicios.tblp_servicios.CveUsuario
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
        nombreAtendedor(result, res[0].CveUsuario, res);
    });
}

Solicitud.list = (cvePer, result) => {

    console.log('solicitud => '+cvePer);

    sql.query(
    `
        SELECT 
        secamgob_db_servicios.tblp_servicios.IdEquipo,
        secamgob_db_servicios.tblp_servicios.CveUsuario,
        secamgob_db_servicios.tblp_servicios.Atendio,
        secamgob_db_servicios.tblp_servicios.CveSistema
        FROM secamgob_db_servicios.tblp_servicios
        join secamgob_db_catalogos.tblc_estatus
        on secamgob_db_catalogos.tblc_estatus.Tipo = 1 
        where secamgob_db_servicios.tblp_servicios.CvePer = ${cvePer}
        and secamgob_db_servicios.tblp_servicios.Estatus = 1
        or secamgob_db_servicios.tblp_servicios.CvePer = ${cvePer}
        and secamgob_db_servicios.tblp_servicios.Estatus = 2
        group by secamgob_db_servicios.tblp_servicios.IdServicio
        order by secamgob_db_servicios.tblp_servicios.IdServicio desc
    `, (err, res) => {
        if(err) result(err, null);


        if(res.length == 0){
            let error = {
                msg: "Sin servicios pendientes."
            }
            result(error, null);
        }else{
            result(null, res);
            for (let index = 0; index < res.length; index++) {
                /*if(res[index].IdEquipo > 0 && res[index].CveSistema == 0){
                    console.log("Equipos");
                    consultaEquipos(cvePer, result);
                }else if(res[index].CveSistema > 0 && res[index].IdEquipo == 0){
                    console.log("Sistema");
                    consultaSistemas(cvePer, result);
                }*/
            }
        }
    });
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

const usuariosDebajo = function(result, sistemas, solcitud, tipo){
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
            result(null, data);
        });

    }else{
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
            result(null, data);
        });
    }
}

const todosLosSistemas =  function(result, tipo, solicitud){
    console.log("Todos los sistemas");
    sql.query(`
        SELECT 
            secamgob_db_catalogos.tblc_sistemas.CveSistema,
            secamgob_db_catalogos.tblc_sistemas.Sistema
        FROM secamgob_db_catalogos.tblc_sistemas;
    `, (err, res)=>{
        if(err) result(err, null);

        if(tipo == "Tecnico"){
            usuariosDebajo(result, res, solicitud);
        }else if(tipo = "Secretaria"){

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
                "${new Date()}",
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

    if(solicitud.cveModulo == undefined || solicitud.cveSistema == undefined || solicitud.CveUsuario == undefined){
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
        FROM
            secamgob_db_catalogos.tblp_herencias
        LEFT JOIN secamgob_db_catalogos.tblc_privilegios 
        ON secamgob_db_catalogos.tblp_herencias.CvePrivilegio = secamgob_db_catalogos.tblc_privilegios.CvePrivilegio
        WHERE
        secamgob_db_catalogos.tblp_herencias.CveUsuario = ${solicitud.cveUsuario} AND
        secamgob_db_catalogos.tblp_herencias.CveSistema = ${solicitud.cveSistema} AND
        secamgob_db_catalogos.tblp_herencias.CveModulo = ${solicitud.cveModulo}
        ORDER BY
        secamgob_db_catalogos.tblc_privilegios.Privilegio ASC
    `, (err, res) => {
        if(err) result(err, null);

        
        //result(null, res);
        //for (let i = 0; i < res.length; i++) {
            console.log(res[res.length-1].Privilegio);
            if(res[res.length-1].Privilegio == "Tecnico"){
                //Secretaria de secretarias
                //result(null, res);
                todosLosSistemas(result, res[res.length-1].Privilegio,solicitud);
            }else if(res[res.length-1].Privilegio == "Secretaria"){
                //Secretarias
                console.log( "Secretaria secretaria:\n2.-Mandar todos los usuarios de bajo de ella.");
                todosLosSistemas(result, res[res.length-1].Privilegio, solicitud);
                //result(null, "Secretaria normal");
            }else{
                //Usuarios normales
                console.log( "Secretaria secretaria:\n3.-Mandar los equipos del usuario elegido.");
                todosLosSistemas(result, res[res.length-1].Privilegio, solicitud);
                //result(null, "normal");
            }
        //}
    });
}

module.exports = Solicitud;