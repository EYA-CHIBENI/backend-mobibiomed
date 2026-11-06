const { body, validationResult } = require('express-validator')
exports.verifSignUp =[
    body('email', 'EMAIL NOT VALID').isEmail(),
    body('password', 'PASSWORD NOT VALID').isStrongPassword()
]
exports.validation=(req,res,next)=>{
    const errors= validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).send(errors)
    }
    next()
}