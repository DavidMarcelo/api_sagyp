const sql = require('./connection');

const Resguardo = function(resguardo){
    this.noEmp = resguardo.noEmp;
};

Resguardo.resg = (noEmp, result) => {
    if(noEmp == undefined || noEmp == ""){
        let error = {
            msg: "Campo vacio, por favor ingrese el número de empleado."
        }
        result(error, null);
    }else{
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
        WHERE secamgob_db_bienesinformaticos.tblp_equipos.NoEmp = ${noEmp}`, (err, res)=>{
            if(err) {
                let error = {
                    msg: "Número de empleado invalido!",
                    //err: err
                }
                result(error, null);
                //result(err, null);
            }else{
                if(res.length == 0){
                    let error = {
                        msg: "No tiene ningun equipo a su disposición!"
                    }
                    result(error, null);
                }else{
                    result(null, res);
                }
            }
        });
    }
}

module.exports = Resguardo;