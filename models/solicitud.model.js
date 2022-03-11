const sql = require('./connection');

const Solicitud = function(solicitud){
    this.cvePer = solicitud.cvePer;
    this.extension = solicitud.extension;
    this.cveSistema = solicitud.cveSistema;
    this.idEquipo = solicitud.idEquipo;
    this.servicio = solicitud.servicio;
    this.noEmp = solicitud.noEmp;
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
            result("Error de numero de empleado (No coincide con el que atendío).", null);
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
    console.log("consulta inicial");
    //var aa = "Mensaje incial";
    //let atendioServicio = [];
    let servicio = [];
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
        secamgob_db_catalogos.tblc_tipoequipo.DesTipEqp
        FROM secamgob_db_servicios.tblp_servicios
        join secamgob_db_bienesinformaticos.tblp_equipos
        on secamgob_db_bienesinformaticos.tblp_equipos.IdEquipo = secamgob_db_servicios.tblp_servicios.IdEquipo
        join secamgob_db_catalogos.tblc_tipoequipo
        on secamgob_db_catalogos.tblc_tipoequipo.CveTipEqp = secamgob_db_bienesinformaticos.tblp_equipos.CveTipEqp
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
    `, (err, res) => {
        if(err) result(err, null);

        
        servicio.push(res);
        if(res.length == 0){
            let error = {
                msg: "La clave no coincide!, verificar de nuevo."
            }
            result(error, null);
        }else{
            for (let i = 0; i < res.length; i++) {
                nombreAtendedor(result, res[i].CveUsuario, servicio);
            }
            
        }
    });
}

const consultaSistemas =  function(cvePer){
    console.log("consulta inicial");
    return 145;
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
            let servicios = [];
            let atendio = [];
            console.log(servicios);
            for (let index = 0; index < res.length; index++) {
                if(res[index].IdEquipo > 0 && res[index].CveSistema == 0){
                    console.log("incio");
                    atendio = consultaEquipos(cvePer, result);
                    console.log("fin",atendio);
                }else if(res[index].CveSistema > 0 && res[index].IdEquipo == 0){
                    console.log("Sistema");
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
                    `, (err, res) => {
                        if(err) result("Error al cargar los sistemas!", null);


                        if(res.length == 0){
                            let error = {
                                msg: "La clave no coincide!, verificar de nuevo."
                            }
                            result(error, null);
                        }else{
                            sql.query(`
                                SELECT
                                Nombre
                                FROM secamgob_db_si_rh.tblc_personal
                                WHERE secamgob_db_si_rh.tblc_personal.NoEmp = ${res.CveUsuario}
                            `,(err, res)=>{
                                if(err) result(err, null);

                                if(res.length == 0){
                                    result("Error de numero de empleado (No coincide con el que atendío).", null);
                                }else{
                                    atendio.push(res);
                                }
                            });
                            servicios.push(res);
                        }
                    });
                }
            }
        }
    });
}

Solicitud.create = (solicitud, result) => {
    console.log(solicitud.cvePer);
    let hoy = new Date();
    console.log(hoy);
    sql.query(`
        INSERT INTO secamgob_db_servicios.tblp_servicios
        (
            secamgob_db_servicios.tblp_servicios.Folio,
            secamgob_db_servicios.tblp_servicios.FecCap,
            secamgob_db_servicios.tblp_servicios.NoEmp,
            secamgob_db_servicios.tblp_servicios.CvePer,
            secamgob_db_servicios.tblp_servicios.IdEquipo,
            secamgob_db_servicios.tblp_servicios.CveUsuario,
            secamgob_db_servicios.tblp_servicios.CveSistema,
            secamgob_db_servicios.tblp_servicios.Extension,
            secamgob_db_servicios.tblp_servicios.ObservaCerrado
        )
        VALUE 
        (
            "${1234}",
            "${hoy}",
            "${solicitud.noEmp}",
            "${solicitud.cvePer}",
            "${solicitud.idEquipo}",
            "${solicitud.cveUsuario}",
            "${solicitud.cveSistema}",
            "${solicitud.extension}",
            "${"no se quue llevara"}"
        )
    `, (err, res) => {
        if(err) result(err, null);

        result(null, "Servicio agregado, exitosamente!")
    });
}

module.exports = Solicitud;