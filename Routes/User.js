const express = require('express')
const userRouter = express.Router()

const { SignUp, SignIn } = require('../Controllers/User');
const { verifSignUp, validation } = require('../Middlewares/Validation');
const { isAuth } = require('../Middlewares/isAuth');
const { isAdmin } = require('../Middlewares/isAdmin');



userRouter.post('/SignUp', verifSignUp, validation, isAdmin, SignUp)
userRouter.post('/SignIn', SignIn)
userRouter.get('/CurrentUser', isAuth, (req,res)=>{res.send(req.user)})


module.exports = userRouter