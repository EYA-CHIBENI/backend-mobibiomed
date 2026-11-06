const mongoose = require('mongoose')

const ValidateId = (req, res, next) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      error: [{ msg: 'Invalid ID format' }]
    })
  }

  next()
}

module.exports = ValidateId