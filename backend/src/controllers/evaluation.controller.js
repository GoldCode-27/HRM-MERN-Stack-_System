const Evaluation = require('../models/evaluation.model');

const createEvaluation = async (req, res) => {
  const { employeeId, score, remarks } = req.body;

  if (!employeeId || score == null) {
    return res.status(400).json({ error: 'employeeId and score are required' });
  }

  const evaluation = new Evaluation({
    employeeId,
    score,
    remarks,
  });

  await evaluation.save();
  res.status(201).json({ message: 'Evaluation recorded', evaluation });
};

module.exports = { createEvaluation };
