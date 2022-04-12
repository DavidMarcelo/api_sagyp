var admin = require("firebase-admin");
var serviceAccount = require("./firebaseSagyp.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports.admin = admin;