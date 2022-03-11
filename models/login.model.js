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
    console.log('login => '+login.clave);

    sql.query(`
        SELECT 
        secamgob_db_si_rh.tblc_personal.CvePer,
        secamgob_db_si_rh.tblc_personal.Nombre,
        secamgob_db_si_rh.tblc_personal.FecNac,
        secamgob_db_catalogos.tblc_usuarios.CveHerencia,
        secamgob_db_catalogos.tblc_usuarios.Foto,
        secamgob_db_catalogos.tblc_usuarios.CveUsuario,
        secamgob_db_catalogos.tblc_usuarios.Usuario,
        secamgob_db_catalogos.tblc_usuarios.Clave,
        secamgob_db_si_rh.tblc_adscricion.DesAds,
        secamgob_db_si_rh.tblc_personal.CveAds
        FROM secamgob_db_si_rh.tblc_personal 
        Join secamgob_db_catalogos.tblc_usuarios on
        secamgob_db_si_rh.tblc_personal.NoEmp = secamgob_db_catalogos.tblc_usuarios.NoEmp
        Join secamgob_db_si_rh.tblc_adscricion on
        secamgob_db_si_rh.tblc_personal.CveAds = secamgob_db_si_rh.tblc_adscricion.CveAds
        where secamgob_db_si_rh.tblc_personal.NoEmp = ${login.noEmp}
        and secamgob_db_catalogos.tblc_usuarios.Clave = "${login.clave}";
    `, (err, res) => {
        if(err) {            
            result(err, null);
        }else{
            if(res.length == 0){
                error = {
                    msj: "Error de usuario o contraseña!"
                }
                result(error, null);
            }else{
                let data = {};
                //El logue fue un exito y devolveremos todos los menus que pertenece esa persona dependiendo al area que esta asignado.
                let userLogueado = res[0];
                sql.query(`
                    SELECT
                    tblp_areas_sistemas.CveSistema,
                    tblp_areas_sistemas.CveUsuario,
                    tblc_sistemas.Sistema
                    FROM
                    secamgob_db_catalogos.tblp_areas_sistemas
                    LEFT JOIN secamgob_db_catalogos.tblc_sistemas ON tblp_areas_sistemas.CveSistema = tblc_sistemas.CveSistema
                    WHERE
                    tblp_areas_sistemas.CveArea = ${res[0].CveAds}
                    ORDER BY
                    tblc_sistemas.Sistema ASC
                `, (err, res) =>{
                    if(err) result(err, null);

                    if(res.length == 0){
                        result("No se encontraros los menu de su area!", null)
                    }else{
                        data = {
                            user: userLogueado,
                            menu: res
                        }
                        result(null, data);
                    }
                });
            }
        }
    });
}

Login.loginMenus = (login, result) => {
    console.log('login => '+login.noEmp);


    sql.query(`
        SELECT 
        secamgob_db_si_rh.tblc_personal.Nombre,
        secamgob_db_catalogos.tblc_usuarios.CveHerencia,
        secamgob_db_catalogos.tblc_usuarios.CveUsuario,
        secamgob_db_catalogos.tblc_usuarios.Usuario,
        secamgob_db_catalogos.tblc_usuarios.Clave,
        secamgob_db_si_rh.tblc_adscricion.DesAds,
        secamgob_db_si_rh.tblc_personal.CveAds
        FROM secamgob_db_si_rh.tblc_personal 
        Join secamgob_db_catalogos.tblc_usuarios on
        secamgob_db_si_rh.tblc_personal.NoEmp = secamgob_db_catalogos.tblc_usuarios.NoEmp
        Join secamgob_db_si_rh.tblc_adscricion on
        secamgob_db_si_rh.tblc_personal.CveAds = secamgob_db_si_rh.tblc_adscricion.CveAds
        where secamgob_db_si_rh.tblc_personal.NoEmp = ${login.noEmp}
        and secamgob_db_catalogos.tblc_usuarios.Clave = ${login.clave};
    `, (err, res) => {
        if(err) result(err, null);

        //El logue fue un exito y devolveremos todos los menus que pertenece esa persona dependiendo al area que esta asignado.
        sql.query(`
            SELECT
            secamgob_db_catalogos.tblp_areas_sistemas.CveSistema,
            secamgob_db_catalogos.tblp_areas_sistemas.CveUsuario,
            secamgob_db_catalogos.tblc_sistemas.Sistema
            FROM
            secamgob_db_catalogos.tblp_areas_sistemas
            LEFT JOIN secamgob_db_catalogos.tblc_sistemas 
            ON secamgob_db_catalogos.tblp_areas_sistemas.CveSistema = secamgob_db_catalogos.tblc_sistemas.CveSistema
            WHERE
            secamgob_db_catalogos.tblp_areas_sistemas.CveArea = ${res[0].CveAds}
            and secamgob_db_catalogos.tblp_areas_sistemas.CveUsuario = ${res[0].CveUsuario}
            ORDER BY
            tblc_sistemas.Sistema ASC
        `, (err, res) =>{
            if(err) result(err, null);

            result(null, res);
        });
    });
}

module.exports = Login;