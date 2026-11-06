
const express = require('express')
const departmentsRouter = express.Router()

const {AddDepartment,GetAllDepartments,GetOneDepartment,UpdateDepartment,DeleteDepartment} = require('../Controllers/ManageDepartments')


departmentsRouter.post('/adddepartment',AddDepartment)
departmentsRouter.get('/getdepartments',GetAllDepartments)
departmentsRouter.get('/getdepartment/:id',GetOneDepartment)
departmentsRouter.patch('/updepartment/:id',UpdateDepartment)
departmentsRouter.delete('/deletedepartment/:id',DeleteDepartment)

module.exports = departmentsRouter
