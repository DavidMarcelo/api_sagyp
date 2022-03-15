const sql = require('./connection');

const Asistencia = function(asistencia){
    this.noEmp = asistencia.noEmp;
};

Asistencia.asis = (noEmp, result) => {
    if(noEmp == undefined){
        let data = {
            msg: "Agregar un numero de empleado!"
        }
        return result(data, null);
    }
    
    sql.query(`
        SELECT 
        	* 
        FROM secamgob_db_si_rh.tblp_registros 
        WHERE secamgob_db_si_rh.tblp_registros.NoEmp = ${noEmp}
        AND secamgob_db_si_rh.tblp_registros.Estatus = "F"
        OR secamgob_db_si_rh.tblp_registros.NoEmp = ${noEmp}
        AND secamgob_db_si_rh.tblp_registros.Estatus = "R"
        order by secamgob_db_si_rh.tblp_registros.Fecha desc`, (err, res)=>{
        if(err) {
            let error = {
                msg: "Error!, número de empleado no existe!",
                //err: err
            }
            result(error, null);
        }else{
            if(res.length == 0){
                error = {
                    msg: "No contiene ninguna Falta o Retardo."
                }
                result(error, null);
            }else{
                result(null, res);
            }
        }
    });
}

module.exports = Asistencia;