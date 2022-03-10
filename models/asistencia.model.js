const sql = require('./connection');

const Asistencia = function(asistencia){
    this.noEmp = asistencia.noEmp;
};

Asistencia.asis = (noEmp, result) => {
    console.log("Asistencia => ", noEmp);
    
    sql.query(`
        SELECT 
        * 
        FROM secamgob_db_si_rh.tblp_registros 
        WHERE secamgob_db_si_rh.tblp_registros.NoEmp = ${noEmp}
        order by secamgob_db_si_rh.tblp_registros.Fecha desc`, (err, res)=>{
        if(err) result(err, null);

        if(res.length == 0){
            error = {
                msg: "Error de numero de empleado!"
            }
            result(error, null);
        }else{
            result(null, res);   
        }
    });
}

module.exports = Asistencia;