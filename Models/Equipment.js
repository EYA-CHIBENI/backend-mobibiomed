const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['operational', 'under_maintenance', 'out_of_service'],
    default: 'operational'
  },
  purchaseDate: {
    type: Date
  },
  criticality: {
  type: String,
  enum: ['low', 'medium', 'high', 'critical'],
  default: 'medium',
  required: true
}

});

module.exports = mongoose.model('Equipment', equipmentSchema);