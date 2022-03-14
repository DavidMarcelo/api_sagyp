const sql = require('./connection');

const Solicitud = function(solicitud){
    this.folio = solicitud.folio;/*Consutar la misma tabla de tbpl_servicios extraen
    en el folio mayor y le suman 1 para aumentarlo*/
    this.noEmp = solicitud.noEmp;/*PARA EL ES EL SERVICIO*/
    this.cvePer = solicitud.cvePer;/*PARA EL ES EL SERVICIO*/
    this.servicio = solicitud.servicio;/*El mensaje que se envia */
    this.servicio = solicitud.noOficio;/** Caundo la solcitud tiene un numero numero o no lo tiene
    no obligatorio*/
    this.servicio = solicitud.observaciones;
    this.idEquipo = solicitud.idEquipo;/**El equipo del usuario */
    this.noEmp = solicitud.cveUsuario; /*EL QUE CAPTURA*/
    this.cveSistema = solicitud.cveSistema;/**sistema que se elige */
    this.cveSistema = solicitud.tipoServicio;/**ES cuando elige si es sistemas o sosporte con el 
    radio button */
    this.extension = solicitud.extension;/**no obligarotio la extension */

    /**Llamar al comentario de la tabla segun la columna */
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
    console.log("consulta inicial",cvePer);
    //var aa = "Mensaje incial";
    //let atendioServicio = [];
    //let servicio = [];
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
    /*sql.query(`
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
    `, (err, res) => {
        if(err) result(err, null);

        console.log("res->",res);
        //servicio.push(res);
        if(res.length == 0){
            let error = {
                msg: "La clave no coincide!, verificar de nuevo."
            }
            result(error, null);
        }else{
            //for (let i = 0; i < res.length; i++) {
            result(null, res);
                //nombreAtendedor(result, res[i].CveUsuario, servicio);
            //}
            
        }
    });*/
}

const consultaSistemas =  function(cvePer, result){
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
            for (let index = 0; index < res.length; index++) {
                if(res[index].IdEquipo > 0 && res[index].CveSistema == 0){
                    console.log("Equipos");
                    consultaEquipos(cvePer, result);
                }else if(res[index].CveSistema > 0 && res[index].IdEquipo == 0){
                    console.log("Sistema");
                    consultaSistemas(cvePer, result);
                }
            }
        }
    });
}

Solicitud.save = (solicitud, result) => {
    sql.query(`
        SELECT Folio FROM
        secamgob_db_servicios.tblp_servicios
        order by secamgob_db_servicios.tblp_servicios.Folio desc
    `,
    (err, res)=>{
        if(err) result(err, null);

        let folio = res[0].Folio+1;
        sql.query(`
            INSERT INTO secamgob_db_servicios.tblp_servicios
            (
                secamgob_db_servicios.tblp_servicios.Folio,
                secamgob_db_servicios.tblp_servicios.NoEmp,
                secamgob_db_servicios.tblp_servicios.CvePer,
                secamgob_db_servicios.tblp_servicios.Servicio,
                secamgob_db_servicios.tblp_servicios.IdEquipo,
                secamgob_db_servicios.tblp_servicios.CveUsuario,
                secamgob_db_servicios.tblp_servicios.CveSistema,
                secamgob_db_servicios.tblp_servicios.Extension,
                secamgob_db_servicios.tblp_servicios.Observaciones,
                secamgob_db_servicios.tblp_servicios.TipoServicio
                secamgob_db_servicios.tblp_servicios.NoOficio
            )
            VALUE 
            (
                "${folio}",
                "${solicitud.noEmp}",
                "${solicitud.cvePer}",
                "${solicitud.servicio}",
                "${solicitud.idEquipo}",
                "${solicitud.cveUsuario}",
                "${solicitud.cveSistema}",
                "${solicitud.extension}",
                "${solicitud.observaciones}",
                "${solicitud.tipoServicio}",
                "${solicitud.noOficio}"
            )
        `, (err, res) => {
            if(err) result(err, null);

            result(null, "Servicio agregado, exitosamente!")
        });
    });
}

Solicitud.create = (solicitud, result) => {

    /*if(solicitud.privilegio == "Usuario"){

    }else if(solicitud.privilegio == "Secretaria"){

    }*/
    sql.query(`SELECT 
        secamgob_db_bienesinformaticos.tblp_equipos.PaqCadena,
        secamgob_db_catalogos.tblc_tipoequipo.DesTipEqp,
        secamgob_db_catalogos.tblc_marcasequipos.DesMarEqp,
        secamgob_db_bienesinformaticos.tblp_equipos.Modelo,
        secamgob_db_bienesinformaticos.tblp_equipos.NoSerie,
        secamgob_db_bienesinformaticos.tblp_equipos.Estado,
        secamgob_db_bienesinformaticos.tblp_equipos.Propiedad,
        secamgob_db_si_rh.tblc_personal.Nombre
    FROM secamgob_db_bienesinformaticos.tblp_equipos 
    INNER JOIN secamgob_db_catalogos.tblc_tipoequipo 
    ON secamgob_db_bienesinformaticos.tblp_equipos.CveTipEqp = secamgob_db_catalogos.tblc_tipoequipo.CveTipEqp
    INNER JOIN secamgob_db_si_rh.tblc_personal
    ON secamgob_db_bienesinformaticos.tblp_equipos.NoEmp = secamgob_db_si_rh.tblc_personal.NoEmp
    INNER JOIN secamgob_db_catalogos.tblc_marcasequipos
    ON secamgob_db_bienesinformaticos.tblp_equipos.CveMarEqp = secamgob_db_catalogos.tblc_marcasequipos.CveMarEqp
    WHERE secamgob_db_bienesinformaticos.tblp_equipos.NoEmp = ${solicitud.noEmp}`, (err, res)=>{
        if(err) result(err, null);

        
        if(res.length == 0){
            let error = {
                msg: "Error, numero de empelado no valido!"
            }
            result(error, null);
        }else{
            let equipos = res;
            sql.query(`
                SELECT
                tblp_areas_sistemas.CveSistema,
                tblp_areas_sistemas.CveUsuario,
                tblc_sistemas.Sistema
                FROM
                secamgob_db_catalogos.tblp_areas_sistemas
                LEFT JOIN secamgob_db_catalogos.tblc_sistemas ON tblp_areas_sistemas.CveSistema = tblc_sistemas.CveSistema
                WHERE
                tblp_areas_sistemas.CveArea = ${solicitud.cveAds}
                ORDER BY
                tblc_sistemas.Sistema ASC
            `, (err, res) =>{
                if(err) result(err, null);


                if(res.length == 0){
                    result("No se encontraron sistemas!", null)
                }else{
                    for (let i = 0; i < res.length; i++) {
                        sql.query(`
                            SELECT
                            tblp_areas_sistemas.CveSistema,
                            tblp_areas_sistemas.CveUsuario,
                            tblc_sistemas.Sistema
                            FROM
                            secamgob_db_catalogos.tblp_areas_sistemas
                            LEFT JOIN secamgob_db_catalogos.tblc_sistemas ON tblp_areas_sistemas.CveSistema = tblc_sistemas.CveSistema
                            WHERE
                            tblp_areas_sistemas.CveArea = ${solicitud.cveAds}
                            ORDER BY
                            tblc_sistemas.Sistema ASC
                        `, (err, res) =>{
                            if(err) result(err, null);

                            
                        });
                    }
                    //console.log("add",add);
                    result(null, "asaasa");
                    /*data = {
                        equipos:  equipos,
                        sistemas: res
                    }
                    result(null, data);*/
                }
            });
            //result(null, res);
        }        
    });
}

module.exports = Solicitud;