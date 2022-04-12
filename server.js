const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');
//const session = require('express-session');
const cors = require('cors');
const app = express();

//---------------------------------------VAPID
//const publicVapidKey = "BK71fD0WrbI8Zg3JcXgRev-h4070inC7rJJ35OvD838Bk8GwBTkr7bZrkpbuXvl7wbkIETbTizhKjWtdxb1CFX0";
//const privateVapidKey = "Tvv3qDJVU010u2g0WNo5gLSLdTnd6EhDKfFLb0tPq5U";
//webpush.setVapidDetails('mailto:cdmarceloz@gmail.com', publicVapidKey, privateVapidKey);

var corsOptions = {
    origin: 'http://localhost:8080'
};
//db.sequelize.sync();
app.use(cors(corsOptions));
//app.use(cors());
//using bodyparser
app.use(express.static(__dirname)); // SERVE STATIC FILES
//app.use(express.static(path.join(__dirname, "client")));
app.use(bodyParser.json());
//app.use(express.json());
app.use(express.urlencoded({ extended: true}));

require('./routes/route.routes')(app);
const PORT = process.env.PORT || 8080;
app.listen(PORT, ()=>{
    console.log('server running in puerto: ',PORT);
});
//------------------------------------------------------------------------------------------------------------
//import express from 'express';
//import bodyparser from 'body-parser';
//import { admin } from './firebase-config';
/*const express = require('express');
const bodyparser = require('body-parser');
const  admin  = require('./firebase-config');

const app = express();
app.use(bodyparser.json());

const port = 3080;
const notification_options = {
  priority: "high",
  timeToLive: 60 * 60 * 24
};
app.post('/firebase/notification', (req, res)=>{
    const  registrationToken = "req.body.registrationToken";
    const message_notification = {
        notification: {
            title: "Titulo del mensaje que enviamos",
            body: "Cuerpo del mensaje que se desea enviar"
        }
    };
    //const message = req.body.message;
    const options = notification_options;
    
      admin.messaging().sendToDevice(registrationToken, message_notification, options)
      .then( response => {
        console.log("notificstion success ", response);
        res.status(200).send("Notification sent successfully");
        //res.json("notificstion success!!!");
       
      })
      .catch( error => {
          console.log(error);
      });

})
app.listen(port, () =>{
  console.log("listening to port:::"+port);
})*/
//------------------------------------------------------------------------------------------------------------
/*const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const cors = require('cors');
//const dotenv = require('dotenv');
const serviceAccount = require("./firebaseSagyp.json");
//using express 
const app = express();



const notification = {
    title: "A Push Notification Test",
    body: "Test Body"
};
const data = {
    key1: "value1",
    key2: "value2"
};

app.use(cors());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

const port = 8080;
app.listen(port, ()=>{
    console.log(`server started on ${port}`)
});

app.post('/sendToDevice', function(req, res){
    console.log("Body: ",req.body);
    const fcmToken = "lskhd123231_!23lkn";//req.body.token;
    const type = "notification";//req.body.type;
    let notificationPayload;

    if(type === 'notification'){
        notificationPayload = {
            "notification": notification
        };
    } else if(type === 'data'){
        notificationPayload = {
            "data": data
        };
    } else{
        notificationPayload = {
            "notification": notification,
            "data": data
        };   
    }

    var notificationOptions = {
        priority: "high"
    };
    admin.messaging().sendToDevice(fcmToken, notificationPayload, notificationOptions)
    .then(function(response) {
        console.log("Successfully sent notification:", response);
        response.json({"Message": "Successfully sent notification"});
    })
    .catch(function(error) {
        console.log("Error sending notification:", error);
        res.json({"Message": "Error sending notification"});
    });
});*/
//------------------------------------------------------------------------------------------------------------
/*const Express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

const serviceAccount = require("./firebaseSagyp.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const tokens = [];

const app = new Express();
const router = Express.Router();

app.use(bodyParser.json());

app.use("/", router);

app.listen(8080, () => {
  console.log(`Server started on port 8080`);
});

router.post("/register", (req, res) => {
  tokens.push(req.body.token);
  console.log("tokens: ",tokens);e
  res.status(200).json({ message: "Successfully registered FCM Token!" });
});

router.post("/notifications", async (req, res) => {
  try {
    const { title, body, imageUrl } = req.body;
    console.log("Success", tokens);
    await admin.messaging().sendMulticast({
      tokens,
      notification: {
        title,
        body,
        imageUrl,
      },
    });
    console.log("Success2");
    res.status(200).json({ message: "Successfully sent notifications!" });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || "Something went wrong!" });
      console.log("Error");
  }
});*/