const mongoose = require('mongoose')
const Schema = mongoose.Schema

const taskSchema = new Schema({
  name: String,
  completed: Boolean
})

module.exports = mongoose.model('Tasks', taskSchema);