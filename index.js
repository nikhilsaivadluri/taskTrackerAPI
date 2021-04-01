const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const mongoose = require('mongoose')
const url = 'mongodb://127.0.0.1:27017/task_tracker';
const routes =require('./routes');
const port = process.env.PORT || 3000;
var path = require("path");
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
//app.use('/', express.static(path.join(__dirname+"/client/build/")));
app.use(function (req, res, next) {
  //Enabling CORS 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,DELETE,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
  next();
});


app.use("/api",routes);

app.listen(port, function() {
    console.log(`listening on ${port}`)
  })