const mongoose = require('mongoose')

const maintenanceRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requestType: {
    type: String,
    enum: ['corrective', 'inspection', 'preventive'],
    default: 'corrective'
  },

  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserOnline',
    required: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserOnline',
    default: null
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserOnline',
    default: null
  },

  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  impact: {
    type: String,
    enum: ['low', 'moderate', 'high', 'critical'],
    default: 'moderate'
  },
  equipmentAvailable: {
    type: Boolean,
    default: true
  },

  preferredInterventionDate: Date,
  expectedStartDate: Date,
  expectedDuration: Number,
  expectedCompletionDate: Date,

  actualStartDate: Date,
  actualCompletionDate: Date,
  actualDuration: Number,
  interventionReport: String,

  status: {
    type: String,
    enum: [
      'pending',
      'under_review',
      'approved',
      'rejected',
      'assigned',
      'in_progress',
      'completed',
      'cancelled'
    ],
    default: 'pending'
  },

  rejectionReason: String,

  attachments: [{
    type: String
  }],

  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserOnline'
    },
    message: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  history: [{
    action: {
      type: String,
      required: true
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserOnline'
    },
    note: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]

}, { timestamps: true })

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema)