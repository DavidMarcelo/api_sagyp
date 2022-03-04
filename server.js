const express = require('express');
const cors = require('cors');
const app = express();
const LoginService = require('./controllers/login.controller');

/*var corsOptions = {
    origin: 'http://localhost:8080'
};*/
//db.sequelize.sync();
//app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get("/", (req, res) => {
    res.json(res);
    res.json(req);
});

require('./routes/route.routes')(app);
const PORT = process.env.PORT || 8080;

app.listen(PORT, ()=>{
    console.log('server running in port: ',PORT);
    console.log(LoginService);
});