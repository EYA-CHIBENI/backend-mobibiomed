const MaintenanceRequest = require('../Models/Request')
const Equipment = require('../Models/Equipment')
const Department = require('../Models/Department')
const User = require('../Models/User')

exports.AddRequest = async (req, res) => {
    try {
        const allowedRoles = [
            'medical_staff',
            'department_manager',
            'maintenance_manager'
        ]

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).send({ error: [{ msg: 'You cannot submit requests' }] })
        }

        const { title, description, requestType, equipment, department, priority, impact, equipmentAvailable, preferredInterventionDate } = req.body

        if (!title || !description || !equipment || !department) {
            return res.status(400).send({ error: [{ msg: 'Please provide all required fields' }] })
        }

        const foundEquipment = await Equipment.findById(equipment)
        const foundDepartment = await Department.findById(department)

        if (foundEquipment.department.trim().toLowerCase() !== foundDepartment.name.trim().toLowerCase()) {
            return res.status(400).send({
                error: [{ msg: 'The selected department does not belong to this equipment' }]
            })
        }

        const newRequest = new MaintenanceRequest({
            title,
            description,
            requestType,
            equipment,
            department,
            priority,
            impact,
            equipmentAvailable,
            preferredInterventionDate,
            createdBy: req.user._id,
            status: 'pending',
            history: [{
                action: 'Request submitted',
                performedBy: req.user._id
            }]
        })

        await newRequest.save()

        res.status(201).send({
            msg: 'Maintenance request submitted successfully',
            newRequest
        })
    } catch (error) {
        res.status(500).send({ error: [{ msg: error.message }] })
    }
}

exports.GetMyRequests = async (req, res) => {
    try {
        const requests = await MaintenanceRequest.find({
            createdBy: req.user._id
        })
            .populate('equipment')
            .populate('department')
            .populate('createdBy', 'name email')
            .populate('reviewedBy', 'name email')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 })

        res.status(200).send({
            msg: 'Your maintenance requests',
            requests
        })
    } catch (error) {
        res.status(500).send({ error: [{ msg: error.message }] })
    }
}
exports.GetPendingRequests = async (req, res) => {
    try {
        if (req.user.role !== 'maintenance_manager') {
            return res.status(403).send({
                error: [{ msg: 'Only maintenance managers can access pending requests' }]
            })
        }

        const requests = await MaintenanceRequest.find({
            status: 'pending'
        })
            .populate('equipment')
            .populate('department')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })

        res.status(200).send({
            msg: 'Pending maintenance requests',
            requests
        })
    } catch (error) {
        res.status(500).send({
            error: [{ msg: error.message }]
        })
    }
}
exports.ClaimRequest = async (req, res) => {
    try {
        if (req.user.role !== 'maintenance_manager') {
            return res.status(403).send({
                error: [{ msg: 'Only maintenance managers can claim requests' }]
            })
        }

        const request = await MaintenanceRequest.findOneAndUpdate(
            {
                _id: req.params.id,
                status: 'pending'
            },
            {
                $set: {
                    status: 'under_review',
                    reviewedBy: req.user._id
                },
                $push: {
                    history: {
                        action: 'Request claimed for review',
                        performedBy: req.user._id
                    }
                }
            },
            { new: true }
        )
            .populate('equipment')
            .populate('department')
            .populate('createdBy', 'name email')
            .populate('reviewedBy', 'name email')

        if (!request) {
            return res.status(409).send({
                error: [{ msg: 'Request is no longer pending or does not exist' }]
            })
        }

        res.status(200).send({
            msg: 'Request successfully claimed',
            request
        })
    } catch (error) {
        res.status(500).send({
            error: [{ msg: error.message }]
        })
    }
}

exports.ApproveRequest = async (req, res) => {
    try {
        if (req.user.role !== 'maintenance_manager') {
            return res.status(403).send({
                error: [{ msg: 'Only maintenance managers can approve requests' }]
            })
        }
        const request = await MaintenanceRequest.findOneAndUpdate(
            {
                _id: req.params.id,
                status: 'under_review',
                reviewedBy: req.user._id
            },
            {
                $set: {
                    status: 'approved'
                },
                $push: {
                    history: {
                        action: 'Request approved',
                        performedBy: req.user._id
                    }
                }
            },
            { new: true }
        )
            .populate('equipment')
            .populate('department')
            .populate('createdBy', 'name email')
            .populate('reviewedBy', 'name email')

        if (!request) {
            return res.status(403).send({
                error: [{ msg: 'You cannot approve this request, or it is no longer under review' }]
            })
        }

        res.status(200).send({
            msg: 'Request approved successfully',
            request
        })
    } catch (error) {
        res.status(500).send({
            error: [{ msg: error.message }]
        })
    }
}
exports.RejectRequest = async (req, res) => {
    try {
        const { rejectionReason } = req.body

        if (!rejectionReason || !rejectionReason.trim()) {
            return res.status(400).send({
                error: [{ msg: 'Please provide a rejection reason' }]
            })
        }

        const request = await MaintenanceRequest.findOneAndUpdate(
            {
                _id: req.params.id,
                status: 'under_review',
                reviewedBy: req.user._id
            },
            {
                $set: {
                    status: 'rejected',
                    rejectionReason: rejectionReason.trim()
                },
                $push: {
                    history: {
                        action: 'Request rejected',
                        performedBy: req.user._id,
                        note: rejectionReason.trim()
                    }
                }
            },
            { new: true }
        )
            .populate('equipment')
            .populate('department')
            .populate('createdBy', 'name email')
            .populate('reviewedBy', 'name email')

        if (!request) {
            return res.status(403).send({
                error: [{ msg: 'You cannot reject this request, or it is no longer under review' }]
            })
        }

        res.status(200).send({
            msg: 'Request rejected successfully',
            request
        })
    } catch (error) {
        res.status(500).send({
            error: [{ msg: error.message }]
        })
    }
}
exports.ScheduleRequest = async (req, res) => {
    try {
        if (req.user.role !== 'maintenance_manager') {
            return res.status(403).send({
                error: [{ msg: 'Only maintenance managers can schedule requests' }]
            })
        }
        const { expectedStartDate, expectedDuration } = req.body

        if (!expectedStartDate || !expectedDuration) {
            return res.status(400).send({
                error: [{ msg: 'Please provide the expected start date and duration' }]
            })
        }
        if (new Date(expectedStartDate) < new Date()) {
    return res.status(400).send({
        error: [{ msg: 'Expected start date cannot be in the past' }]
    })
}

        const startDate = new Date(expectedStartDate)
        const duration = Number(expectedDuration)

        if (isNaN(startDate.getTime()) || !Number.isFinite(duration) || duration <= 0) {
            return res.status(400).send({
                error: [{ msg: 'Please provide a valid date and a positive duration' }]
            })
        }

        const expectedCompletionDate = new Date(
            startDate.getTime() + duration * 60 * 60 * 1000
        )

        const request = await MaintenanceRequest.findOneAndUpdate(
            {
                _id: req.params.id,
                status: 'approved',
                reviewedBy: req.user._id,
                expectedStartDate: null
            },
            {
                $set: {
                    expectedStartDate: startDate,
                    expectedDuration: duration,
                    expectedCompletionDate
                },
                $push: {
                    history: {
                        action: 'Intervention scheduled',
                        performedBy: req.user._id,
                        note: `Expected start: ${startDate.toISOString()}, duration: ${duration} hours`
                    }
                }
            },
            { new: true }
        )
            .populate('equipment')
            .populate('department')
            .populate('createdBy', 'name email')
            .populate('reviewedBy', 'name email')

        if (!request) {
            return res.status(403).send({
                error: [{ msg: 'You cannot schedule this request, or it is not approved' }]
            })
        }

        res.status(200).send({
            msg: 'Intervention scheduled successfully',
            request
        })
    } catch (error) {
        res.status(500).send({
            error: [{ msg: error.message }]
        })
    }
}
exports.AssignTechnician = async (req, res) => {
    try {
        if (req.user.role !== 'maintenance_manager') {
            return res.status(403).send({
                error: [{ msg: 'Only maintenance managers can assign technicians' }]
            })
        }

        const { assignedTo } = req.body

        if (!assignedTo) {
            return res.status(400).send({
                error: [{ msg: 'Please select a technician' }]
            })
        }

        const technician = await User.findById(assignedTo)

        if (!technician || technician.role !== 'technician' || !technician.isActive) {
            return res.status(400).send({
                error: [{ msg: 'Please select a valid active technician' }]
            })
        }

        const request = await MaintenanceRequest.findOneAndUpdate(
            {
                _id: req.params.id,
                status: 'approved',
                reviewedBy: req.user._id,
                expectedStartDate: { $type: 'date' },
                expectedDuration: { $gt: 0 },
                expectedCompletionDate: { $type: 'date' }
            },
            {
                $set: {
                    assignedTo: technician._id,
                    status: 'assigned'
                },
                $push: {
                    history: {
                        action: 'Technician assigned',
                        performedBy: req.user._id,
                        note: `Assigned to ${technician.name}`
                    }
                }
            },
            { new: true }
        )
            .populate('equipment')
            .populate('department')
            .populate('createdBy', 'name email')
            .populate('reviewedBy', 'name email')
            .populate('assignedTo', 'name email')

        if (!request) {
            return res.status(409).send({
                error: [{ msg: 'Request is not approved, not scheduled, or you are not its reviewer' }]
            })
        }

        res.status(200).send({
            msg: 'Technician assigned successfully',
            request
        })
    } catch (error) {
        res.status(500).send({
            error: [{ msg: error.message }]
        })
    }
}
exports.StartIntervention = async (req, res) => {
    try {
        if (req.user.role !== 'technician') {
            return res.status(403).send({
                error: [{ msg: 'Only technicians can start interventions' }]
            })
        }

        const request = await MaintenanceRequest.findOneAndUpdate(
            {
                _id: req.params.id,
                assignedTo: req.user._id,
                status: 'assigned'
            },
            {
                $set: {
                    status: 'in_progress',
                    actualStartDate: new Date()
                },
                $push: {
                    history: {
                        action: 'Intervention started',
                        performedBy: req.user._id
                    }
                }
            },
            { new: true }
        )
            .populate('equipment')
            .populate('department')
            .populate('createdBy', 'name email')
            .populate('reviewedBy', 'name email')
            .populate('assignedTo', 'name email')

        if (!request) {
            return res.status(409).send({
                error: [{ msg: 'You are not assigned to this request, or it has already been started' }]
            })
        }

        res.status(200).send({
            msg: 'Intervention started successfully',
            request
        })
    } catch (error) {
        res.status(500).send({
            error: [{ msg: error.message }]
        })
    }
}
exports.CompleteIntervention = async (req, res) => {
    try {
        if (req.user.role !== 'technician') {
            return res.status(403).send({
                error: [{ msg: 'Only technicians can complete interventions' }]
            })
        }

        const { interventionReport } = req.body

        if (!interventionReport || !interventionReport.trim()) {
            return res.status(400).send({
                error: [{ msg: 'Please provide an intervention report' }]
            })
        }

        const requestToComplete = await MaintenanceRequest.findOne({
            _id: req.params.id,
            assignedTo: req.user._id,
            status: 'in_progress'
        })

        if (!requestToComplete) {
            return res.status(409).send({
                error: [{ msg: 'You are not assigned to this request, or it is not in progress' }]
            })
        }

        console.log('Actual start date:', requestToComplete.actualStartDate)
        console.log('Date type:', typeof requestToComplete.actualStartDate)
        console.log('Is valid date:', requestToComplete.actualStartDate instanceof Date)

        if (
            !requestToComplete.actualStartDate ||
            isNaN(requestToComplete.actualStartDate.getTime())
        ) {
            return res.status(400).send({
                error: [{ msg: 'Invalid intervention start date' }]
            })
        }

        const actualCompletionDate = new Date()

        const actualDuration = (
            actualCompletionDate - requestToComplete.actualStartDate
        ) / (1000 * 60 * 60)

        requestToComplete.status = 'completed'
        requestToComplete.actualCompletionDate = actualCompletionDate
        requestToComplete.actualDuration = actualDuration
        requestToComplete.interventionReport = interventionReport.trim()

        requestToComplete.history.push({
            action: 'Intervention completed',
            performedBy: req.user._id,
            note: interventionReport.trim()
        })

        await requestToComplete.save()

        res.status(200).send({
            msg: 'Intervention completed successfully',
            request: requestToComplete
        })
    } catch (error) {
        console.error('Complete Intervention Error:', error)
        res.status(500).send({
            error: [{ msg: error.message }]
        })
    }
}
exports.AddComment = async (req, res) => {
    try {
        const { message } = req.body

        if (!message || !message.trim()) {
            return res.status(400).send({
                error: [{ msg: 'Please enter a comment' }]
            })
        }

        const request = await MaintenanceRequest.findById(req.params.id)

        if (!request) {
            return res.status(404).send({
                error: [{ msg: 'Maintenance request not found' }]
            })
        }

        const userId = req.user._id.toString()

        const isParticipant = [
            request.createdBy,
            request.reviewedBy,
            request.assignedTo
        ].some(user => user && user.toString() === userId)

        if (!isParticipant) {
            return res.status(403).send({
                error: [{ msg: 'You are not authorized to comment on this request' }]
            })
        }

        request.comments.push({
            user: req.user._id,
            message: message.trim()
        })

        await request.save()

        const updatedRequest = await MaintenanceRequest.findById(req.params.id)
            .populate('comments.user', 'name email')

        res.status(201).send({
            msg: 'Comment added successfully',
            comments: updatedRequest.comments
        })
    } catch (error) {
        res.status(500).send({
            error: [{ msg: error.message }]
        })
    }
}
exports.CancelRequest = async (req, res) => {
    try {
        const request = await MaintenanceRequest.findOneAndUpdate(
            {
                _id: req.params.id,
                createdBy: req.user._id,
                status: 'pending'
            },
            {
                $set: {
                    status: 'cancelled'
                },
                $push: {
                    history: {
                        action: 'Request cancelled by requester',
                        performedBy: req.user._id
                    }
                }
            },
            { new: true }
        )

        if (!request) {
            return res.status(409).send({
                error: [{ msg: 'You cannot cancel this request. It may not belong to you or is no longer pending' }]
            })
        }

        res.status(200).send({
            msg: 'Request cancelled successfully',
            request
        })
    } catch (error) {
        res.status(500).send({
            error: [{ msg: error.message }]
        })
    }
}
exports.GetOneRequest = async (req, res) => {
    try {
        const request = await MaintenanceRequest.findById(req.params.id)
            .populate('equipment')
            .populate('department')
            .populate('createdBy', 'name email role')
            .populate('reviewedBy', 'name email')
            .populate('assignedTo', 'name email')
            .populate('comments.user', 'name role')
            .populate('history.performedBy', 'name role')

        if (!request) {
            return res.status(404).send({
                error: [{ msg: 'Request not found' }]
            })
        }

        const userId = req.user._id.toString()

        const isParticipant = [
            request.createdBy?._id.toString(),
            request.reviewedBy?._id.toString(),
            request.assignedTo?._id.toString()
        ].includes(userId)

        if (!isParticipant && req.user.role !== 'maintenance_manager' && req.user.role !== 'admin') {
            return res.status(403).send({
                error: [{ msg: 'You are not allowed to view this request' }]
            })
        }

        res.status(200).send({ request })
    } catch (error) {
        res.status(500).send({ error: [{ msg: error.message }] })
    }
}

exports.GetMyReviews = async (req, res) => {
    try {
        if (req.user.role !== 'maintenance_manager') {
            return res.status(403).send({
                error: [{ msg: 'Only maintenance managers can access their reviews' }]
            })
        }

        const requests = await MaintenanceRequest.find({
            reviewedBy: req.user._id,
            status: {
                $in: [
                    'under_review',
                    'approved',
                    'rejected',
                    'assigned',
                    'in_progress',
                    'completed'
                ]
            }
        })
            .populate('equipment')
            .populate('department')
            .populate('createdBy', 'name email role')
            .populate('reviewedBy', 'name email')
            .populate('assignedTo', 'name email')

        res.status(200).send({ requests })
    } catch (error) {
        res.status(500).send({
            error: [{ msg: error.message }]
        })
    }
}

exports.GetMyAssignments = async (req, res) => {
    try {
        if (req.user.role !== 'technician') {
            return res.status(403).send({
                error: [{ msg: 'Technicians only' }]
            })
        }

        const requests = await MaintenanceRequest.find({
            assignedTo: req.user._id,
            status: { $in: ['assigned', 'in_progress', 'completed'] }
        })
            .populate('equipment')
            .populate('department')
            .populate('createdBy', 'name email')
            .populate('reviewedBy', 'name email')

        res.status(200).send({ requests })
    } catch (error) {
        res.status(500).send({
            error: [{ msg: error.message }]
        })
    }
}
exports.GetAllRequests = async (req, res) => {
    try {
        const requests = await MaintenanceRequest.find()
            .populate('equipment')
            .populate('department')
            .populate('createdBy', 'name email role')
            .populate('reviewedBy', 'name email')
            .populate('assignedTo', 'name email')
            .sort({ createdAt: -1 })

        res.status(200).send({ requests })
    } catch (error) {
        res.status(500).send({ error: [{ msg: error.message }] })
    }
}