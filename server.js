const express = require ('express')
const ConnectDB = require('./config/ConnectDB')
const userRouter = require('./Routes/User')
const usersRouter = require('./Routes/ManageUsers')
const equipmentsRouter = require('./Routes/ManageEquipments')
const departmentsRouter = require('./Routes/ManageDepartments')
const requestsRouter = require('./Routes/ManageRequests')
const cors = require('cors')

const app = express()

app.use(cors({
  origin: process.env.cors_origin,
  credentials: true 
}))
require('dotenv').config()
ConnectDB()
app.use(express.json())
app.use('/api/userAuth',userRouter)
app.use('/api/users',usersRouter)
app.use('/api/equipments', equipmentsRouter)
app.use('/api/departments', departmentsRouter)
app.use('/api/requests', requestsRouter)

app.listen(process.env.port, console.log`server is running on ${process.env.port}`)



