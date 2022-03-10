const sql = require('./connection');

const Solicitud = function(solicitud){
    this.cvePer = solicitud.cvePer;
};

Solicitud.list = (cvePer, result) => {
    console.log('solicitud => '+cvePer);

    sql.query(`
        SELECT 
        *
        FROM secamgob_db_servicios.tblp_servicios
        where secamgob_db_servicios.tblp_servicios.CvePer = ${cvePer}
    `, (err, res) => {
        console.log(res);
        if(err) result(err, null);

        result(null, res);
    });
}

Solicitud.create = (solicitud, result) => {
    sql.query(`
        
    `, (err, res) => {
    });
}

module.exports = Solicitud;