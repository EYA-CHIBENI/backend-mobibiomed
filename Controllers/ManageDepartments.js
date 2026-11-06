
const Department = require('../Models/Department')
const User = require('../Models/User')

exports.AddDepartment = async (req, res) => {
  try {
    const newDepartment = new Department(req.body)
    await newDepartment.save()

    res.status(201).send({
      msg: 'Department added successfully',
      newDepartment
    })
  } catch (error) {
    res.status(500).send({ error: [{ msg: error.message }] })
  }
}

exports.GetAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('manager', 'name email')

    res.status(200).send({
      msg: 'All departments',
      departments
    })
  } catch (error) {
    res.status(500).send({ error: [{ msg: error.message }] })
  }
}

exports.GetOneDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id).populate('manager', 'name email')

    if (!department) {
      return res.status(404).send({ error: [{ msg: 'Department not found' }] })
    }

    res.status(200).send({
      msg: 'Department found',
      department
    })
  } catch (error) {
    res.status(500).send({ error: [{ msg: error.message }] })
  }
}

exports.UpdateDepartment = async (req, res) => {
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('manager', 'name email')

    if (!updatedDepartment) {
      return res.status(404).send({ error: [{ msg: 'Department not found' }] })
    }

    res.status(200).send({
      msg: 'Department updated successfully',
      updatedDepartment
    })
  } catch (error) {
    res.status(500).send({ error: [{ msg: error.message }] })
  }
}

exports.DeleteDepartment = async (req, res) => {
  try {
    const deletedDepartment = await Department.findByIdAndDelete(req.params.id)

    if (!deletedDepartment) {
      return res.status(404).send({ error: [{ msg: 'Department not found' }] })
    }

    res.status(200).send({
      msg: 'Department deleted successfully',
      deletedDepartment
    })
  } catch (error) {
    res.status(500).send({ error: [{ msg: error.message }] })
  }
}
