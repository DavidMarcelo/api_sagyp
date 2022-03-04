const sql = require('./connection');

const Login = function(login){
    this.noEmp = login.noEmp;
    this.clave = login.clave;
};

Login.getAll = result => {
    let query = "SELECT * FROM secamgob_db_si_rh.tblc_personal WHERE NoEmp = 61854";
    sql.query(query, (err, res) => {
        if(err) result (null, err);

        result (null, res);
    });
};

Login.login = (login, result) => {
    console.log('clave => '+login.noEmp);
    sql.query(`SELECT * FROM tblc_usuarios WHERE NoEmp = ${login.noEmp}`, (err, res)=>{
        if (err) result(err, null);


        sql.query(`SELECT * FROM tblc_usuarios WHERE Clave = ${login.clave}`, (err, res)=>{
            if(err) result(err, null);
            sql.query(`SELECT * FROM tblp_herencias INNER JOIN tblc_sistemas 
            WHERE tblp_herencias.CveUsuario = ${res[0].CveUsuario} GROUP BY tblp_herencias.CveSistema`, (err, res)=>{
                if(err) result(err, null);
                /*sql.query(`SELECT * FROM tblp_herencias INNER JOIN tblc_modulos
                    WHERE tblp_herencias.CveUsuario = ${res[1].CveUsuario} 
                     ORDER BY tblc_modulos.orden ASC`, (err, res) => {
                        //AND tblc_modulos.CveModulo = ${res[1].CveModulo}
                        //AND tblp_herencias.CvePrivilegio = ${res[1].CvePrivilegio}
                        //AND tblp_herencias.CveSistema = ${res[1].CveSistema} 
                        if(err) result(err, null);
                        console.log("module ->");
                        result(null, res);
                    });*/
                    console.log(res.length);
                result(null, res);
            });
        });
    });
}

/*Login.asis = (noEmp, result) => {
    console.log("Asistencia", noEmp);
    
    sql.query(`SELECT * FROM secamgob_db_si_rh.tblp_registros WHERE secamgob_db_si_rh.tblp_registros.NoEmp = ${noEmp}`, (err, res)=>{
        if(err) result(err, null);

        result(null, res);
    });
}*/

module.exports = Login;