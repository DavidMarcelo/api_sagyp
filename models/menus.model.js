const sql = require('./connection');

const Menu = function(menu){
    this.cveSistema = menu.cveSistema;
    this.cveUsuario = menu.cveUsuario;
    this.cveModulo  = menu.cveModulo;
};

Menu.getMenu = (menu, result) => {
    sql.query(`
        SELECT
        tblp_herencias.CveModulo,
        tblp_herencias.CveUsuario,
        tblc_modulos.Modulo
        FROM
        secamgob_db_catalogos.tblp_herencias
        JOIN secamgob_db_catalogos.tblc_modulos 
        ON tblp_herencias.CveModulo = tblc_modulos.CveModulo
        WHERE
        tblp_herencias.CveSistema = ${menu.cveSistema} AND
        tblp_herencias.CveUsuario = ${menu.cveUsuario} AND
        tblp_herencias.CvePrivilegio = 40
        ORDER BY
        tblc_modulos.orden ASC
    `, (err, res) => {
        if(err) {
            let error = {
                msg: "La clave de sistema o usuario no coinciden, verificar nuevamente!",
                //err: err
            }
            result(error, null);
        }else{
            if(res.length == 0){
                let error = {
                    msg: "No tiene permisos para este sistema!"
                }
                result(error, null);
            }else{
                /**/
                result(null, res);
            }
        }
    });
}

Menu.getModulo = (menu, result) => {
    if (menu.cveModulo==undefined || menu.cveModulo=="" || menu.cveSistema==undefined || menu.cveSistema==""
    || menu.cveUsuario==undefined || menu.cveUsuario==""){
        let error = {
            msg: "Las claves no estan bien definidas, verificar nuevamente!"
        }
        result(error, null);
    }else{
        sql.query(`
            SELECT
            tblp_herencias.CvePrivilegio,
            tblp_herencias.CveModulo,
            tblc_modulos.Modulo
            FROM
            secamgob_db_catalogos.tblp_herencias
            LEFT JOIN secamgob_db_catalogos.tblc_modulos 
            ON tblp_herencias.CveModulo = tblc_modulos.CveModulo
            join secamgob_db_catalogos.tblc_privilegios
            WHERE
            tblp_herencias.CveSistema = ${menu.cveSistema} AND
            tblp_herencias.CveUsuario = ${menu.cveUsuario} AND
            tblc_modulos.OpModulo = ${menu.cveModulo}
            group by tblc_modulos.CveModulo
            ORDER BY tblc_modulos.orden ASC
        `, (err, res)=>{
            if(err) {
                let error = {
                    msg: "No tienes ningun permiso para este modulo",
                    //err: err
                }
                result(error, null);
            }else{
                if(res.length == 0){
                    let error = {
                        msg: "No tienes permisos para este modulo!",
                    }
                    result(error, null);
                }else{
                    result(null, res);
                }
            }
        });
    }
}

module.exports = Menu;