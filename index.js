const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const mongoose = require('mongoose')
const url = 'mongodb://127.0.0.1:27017/task_tracker';
const routes =require('./routes');
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})


// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());


app.use("/api",routes);

app.listen(3000, function() {
    console.log('listening on 3000')
  })