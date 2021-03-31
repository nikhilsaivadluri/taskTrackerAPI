const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema({
  //_id: String,
  name: String, 
  completed: Boolean
})

module.exports = mongoose.model('Tasks', taskSchema);