const sql = require('./connection');

const Resguardo = function(resguardo){
    this.noEmp = resguardo.noEmp;
};

Resguardo.resg = (noEmp, result) => {
    console.log("Resguardo: ", noEmp);

    if(noEmp == undefined){
        let error = {
            msg: "Dato no establecido, enviar solo numero de empelado como 'noEmp'."
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
            if(err) result(err, null);

            
            if(res.length == 0){
                let error = {
                    msg: "Error, numero de empelado no valido!"
                }
                result(error, null);
            }else{
                result(null, res);
            }        
        });
    }
}

module.exports = Resguardo;