const sql = require('./connection');

const Asistencia = function(asistencia){
    this.noEmp = asistencia.noEmp;
};

/*Asistencia.getAll = result => {
    let query = "SELECT * FROM secamgob_db_si_rh.tblc_personal WHERE NoEmp = 61854";
    sql.query(query, (err, res) => {
        if(err) result (null, err);

        result (null, res);
    });
};*/

Asistencia.asis = (noEmp, result) => {
    console.log("Asistencia", noEmp);
    
    sql.query(`SELECT * FROM secamgob_db_si_rh.tblp_registros WHERE secamgob_db_si_rh.tblp_registros.NoEmp = ${noEmp}`, (err, res)=>{
        if(err) result(err, null);

        result(null, res);
    });
}

module.exports = Asistencia;