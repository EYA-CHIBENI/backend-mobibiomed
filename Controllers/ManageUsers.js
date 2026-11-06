const User = require('../Models/User')
exports.UpdateOneUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUser = await User.findByIdAndUpdate(id, { $set: req.body })
        if (!updatedUser) {
            return res.status(404).send({ msg: 'User not found' })
        }
        res.status(200).send({ msg: 'User updated', updatedUser })
    } catch (error) {
        res.status(500).send('Could not update user')
    }
}
exports.GetAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).send({ msg: 'All users', users })
    } catch (error) {
        res.status(500).send('Could not get users')
    }
}
exports.GetOneUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)

        if (!user) {
            return res.status(404).send({ msg: 'User not found' })
        }

        res.status(200).send({ msg: 'User found', user })
    } catch (error) {
        res.status(500).send('Could not get user')
    }
}
exports.DeleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).send({ msg: 'User not found' });
        }

        res.status(200).send({ msg: 'User deleted', deletedUser: {_id: deletedUser._id, name: deletedUser.name}})
    } catch (error) {
        res.status(500).send('Could not delete user')
    }
}
