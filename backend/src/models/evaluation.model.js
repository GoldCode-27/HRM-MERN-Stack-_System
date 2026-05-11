const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Evaluation = mongoose.model('Evaluation', evaluationSchema);
module.exports = Evaluation;
