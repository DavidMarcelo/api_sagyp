const sql = require('./connection');

const Solicitud = function(solicitud){
    this.cvePer = solicitud.cvePer;
    this.folio = solicitud.folio;
    this.fecha = solicitud.fecha;
    this.extension = solicitud.extension;
    this.cveSistema = solicitud.cveSistema;
    this.idEquipo = solicitud.idEquipo;
    this.servicio = solicitud.servicio;
};


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
            console.log(res[0].IdEquipo);
            let servicios = [];
            let atendio = [];
            console.log(servicios);
            for (let index = 0; index < res.length; index++) {
                if(res[index].IdEquipo > 0 && res[index].CveSistema == 0){
                    sql.query(`
                        SELECT 
                        secamgob_db_servicios.tblp_servicios.Folio,
                        secamgob_db_servicios.tblp_servicios.FecCap,
                        secamgob_db_servicios.tblp_servicios.TipoServ,
                        secamgob_db_catalogos.tblc_estatus.DesEst,
                        secamgob_db_si_rh.tblc_personal.Nombre,
                        secamgob_db_catalogos.tblc_tipoequipo.DesTipEqp
                        FROM secamgob_db_servicios.tblp_servicios
                        join secamgob_db_catalogos.tblc_tipoequipo
                        on secamgob_db_catalogos.tblc_tipoequipo.CveTipEqp = secamgob_db_servicios.tblp_servicios.IdEquipo
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
                        if(err) result("Error al cargar los equipos!", null);

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
                }else if(res[index].CveSistema > 0 && res[index].IdEquipo == 0){
                    sql.query(`
                        SELECT 
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
            let data = {
                atendio: atendio,
                solicito: servicios
            }
            console.log(data);
            result(null, data);
        }
    });
}

Solicitud.create = (solicitud, result) => {
    sql.query(`
        
    `, (err, res) => {
    });
}

module.exports = Solicitud;