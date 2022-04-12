const sql = require('./connection');
const admin = require('../firebase-config');

const Notificacion = function(notification){
    this.token = notification.token;
    this.title = notification.title;
    this.body = notification.body;
};

Notificacion.send = (notificacion, result) => {
    //Configuracion de la notificacion
    const notification_options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    };
    //Token del dispositivo
    const  registrationToken = notificacion.token;//"req.body.registrationToken";
    //Mensaje
    const message_notification = {
        notification: {
            title: notificacion.title,//"Titulo del mensaje que enviamos",
            body: notificacion.body//"Cuerpo del mensaje que se desea enviar"
        }
    };
    //const message = req.body.message;
    const options = notification_options;
    
    admin.messaging().sendToDevice(registrationToken, message_notification, options)
    .then( response => {
        console.log("notificstion success ", response);
        res.status(200).send("Notification sent successfully");
        //res.json("notificstion success!!!");
    }).catch( error => {
        console.log(error);
    });
    /*getAuth().verifyIdToken(idToken)
    .then((decodedToken) => {
        const uid = decodedToken.uid;
        // ...
    }).catch((error) => {
        // Handle error
    });*/
}

module.exports = Notificacion;