const User = require('../Models/User')
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
exports.SignUp = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const found = await User.findOne({ email })
        if (found) {
            res.status(400).send({ errors: [{ msg: "Email already exists" }] })
        } else {
            const newUser = new User(req.body)
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds)
            const hashpassword = await bcrypt.hash(password, salt)
            newUser.password = hashpassword
            await newUser.save()
            const payload = { id: newUser._id }
            var token = jwt.sign(payload, process.env.privateKey, { expiresIn: '1h' })
            res.status(200).send({ msg: "account created", newUser, token })
        }
    } catch (error) {
        res.status(500).send({ error: [{ msg: "coulfd not create account" }] })
    }
}
exports.SignIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const found = await User.findOne({ email })
        if (!found) {
            res.status(400).send({ errors: [{ msg: "Email anot found" }] })
        } else {
            const matched = await bcrypt.compareSync(password, found.password)
            if (!matched) {
                return res.status(400).send({ errors: [{ msg: "wrong password" }] })
            }
            const payload = { id: found._id }
            var token = await jwt.sign(payload, process.env.privateKey, { expiresIn: '1h' })
            res.status(200).send({ msg: "logged in", found, token })
        }
    } catch (error) {
        res.status(500).send({ error: [{ msg: "coulfd not login" }] })
    }
}
