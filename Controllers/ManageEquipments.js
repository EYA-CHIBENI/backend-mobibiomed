const Equipment = require('../Models/Equipment');

exports.AddEquipment = async (req, res) => {
    try {
        const newEquipment = new Equipment(req.body)
        await newEquipment.save()

        res.status(201).send({
            msg: 'Equipment added successfully',
            newEquipment
        })
    } catch (error) {
        res.status(400).send({
            error: [{ msg: error.message }]
        })
    }
}

exports.GetAllEquipments = async (req, res) => {
    try {
        const equipments = await Equipment.find();

        res.status(200).send({
            msg: 'All equipments',
            equipments
        })
    } catch (error) {
        res.status(500).send({
            error: [{ msg: error.message }]
        })
    }
}

exports.GetOneEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);

        if (!equipment) {
            return res.status(404).send({
                error: [{ msg: 'Equipment not found' }]
            });
        }

        res.status(200).send({
            msg: 'Equipment found',
            equipment
        })
    } catch (error) {
        res.status(500).send({
            error: [{ msg: error.message }]
        })
    }
}

exports.UpdateEquipment = async (req, res) => {
    try {
        const updatedEquipment = await Equipment.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        )

        if (!updatedEquipment) {
            return res.status(404).send({
                error: [{ msg: 'Equipment not found' }]
            })
        }

        res.status(200).send({
            msg: 'Equipment updated successfully',
            updatedEquipment
        })
    } catch (error) {
        res.status(400).send({
            error: [{ msg: error.message }]
        })
    }
}

exports.DeleteEquipment = async (req, res) => {
    try {
        const deletedEquipment = await Equipment.findByIdAndDelete(
            req.params.id
        )

        if (!deletedEquipment) {
            return res.status(404).send({
                error: [{ msg: 'Equipment not found' }]
            })
        }

        res.status(200).send({
            msg: 'Equipment deleted successfully',
            deletedEquipment
        })
    } catch (error) {
        res.status(500).send({
            error: [{ msg: error.message }]
        })
    }
}