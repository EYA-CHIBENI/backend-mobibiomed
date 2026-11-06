const express = require('express');
const equipmentsRouter = express.Router();

const {
  AddEquipment,
  GetAllEquipments,
  GetOneEquipment,
  UpdateEquipment,
  DeleteEquipment
} = require('../Controllers/ManageEquipments')

const isAuth = require('../Middlewares/isAuth')
const isAdmin = require('../Middlewares/isAdmin')

equipmentsRouter.post('/addequipment', AddEquipment)

equipmentsRouter.get('/getequipments',  GetAllEquipments)

equipmentsRouter.get('/getequipment/:id', GetOneEquipment)

equipmentsRouter.patch('/upequipment/:id',  UpdateEquipment)

equipmentsRouter.delete('/deleteequipment/:id', DeleteEquipment)

module.exports = equipmentsRouter