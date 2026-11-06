
const mongoose = require('mongoose')

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  building: {
    type: String
  },
  floor: {
    type: String
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserOnline'
  },
  contact: {
    type: String
  }
})

module.exports = mongoose.model('Department', departmentSchema)
