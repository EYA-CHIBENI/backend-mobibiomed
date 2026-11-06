const express = require('express')
const usersRouter = express.Router()
const {GetAllUsers,GetOneUser,UpdateOneUser, DeleteUser} = require('../Controllers/ManageUsers')
const { isAuth } = require('../Middlewares/isAuth')
const {isAdmin} = require('../Middlewares/isAdmin')

usersRouter.get('/getusers',isAuth, GetAllUsers)
usersRouter.get('/getuser/:id',isAuth ,GetOneUser)
usersRouter.patch('/upuser/:id',isAuth, isAdmin, UpdateOneUser)
usersRouter.delete('/deleteuser/:id',isAuth, isAdmin, DeleteUser)



module.exports = usersRouter