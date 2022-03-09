const sql = require('./connection');

const Menu = function(menu){
    this.cveSistema = menu.cveSistema;
    this.cveUsuario = menu.cveUsuario;
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
        LEFT JOIN secamgob_db_catalogos.tblc_modulos 
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
            result(null, res);
        }
    });
}

module.exports = Menu;