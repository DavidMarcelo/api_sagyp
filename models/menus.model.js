const sql = require('./connection');

const Menu = function(menu){
    this.cveSistema = menu.cveSistema;
    this.cveUsuario = menu.cveUsuario;
    this.cveModulo  = menu.cveModulo;
};

Menu.getMenu = (menu, result) => {
    console.log('Menu => ',menu);

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
        if(err) result(err, null);

        if(res.length == 0){
            let error = {
                msg: "No tiene permisos para este sistema!"
            }
            result(error, null);
        }else{
            /**/
            result(null, res);
        }
    });
}

Menu.getModulo = (menu, result) => {
    console.log("Modulo");
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
        if(err) result(err, null);

        result(null, res);
        /*sql.query(`
            SELECT
            tblp_herencias.CveHerencia,
            tblp_herencias.CvePrivilegio,
            tblc_privilegios.Privilegio,
            tblc_privilegios.Descripcion
            FROM
            tblp_herencias
            LEFT JOIN tblc_privilegios ON tblp_herencias.CvePrivilegio = tblc_privilegios.CvePrivilegio
            WHERE
            tblp_herencias.CveUsuario = ${menu.cveUsuario} AND
            tblp_herencias.CveSistema = ${menu.cveSistema} AND
            tblp_herencias.CveModulo = ${res.CveModulo}
            ORDER BY
            tblc_privilegios.Privilegio ASC
        `,(err,res) => {
            result(null, err);
        });*/
    });
}

module.exports = Menu;