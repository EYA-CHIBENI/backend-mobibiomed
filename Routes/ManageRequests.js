const express = require('express')
const requestsRouter = express.Router()
const ValidateId = require('../Middlewares/ValidateId')
const {
  AddRequest,
  GetMyRequests,
  GetPendingRequests,
  ClaimRequest,
  ApproveRequest,
  RejectRequest,
  ScheduleRequest,
  AssignTechnician,
  StartIntervention,
  CompleteIntervention,
  AddComment,
  CancelRequest,
  GetOneRequest,
  GetMyReviews,
  GetMyAssignments,
  GetAllRequests
} = require('../Controllers/ManageRequests')
const {isAdmin} = require('../Middlewares/isAdmin')

const {isAuth} = require('../Middlewares/isAuth')

requestsRouter.get('/getrequest/:id', isAuth, ValidateId, GetOneRequest)
// admin operations
requestsRouter.get('/getallrequests', isAuth, isAdmin, GetAllRequests)

// Requester operations
requestsRouter.post('/addrequest', isAuth,  AddRequest)
requestsRouter.get('/myrequests', isAuth,  GetMyRequests)
requestsRouter.patch('/cancel/:id', isAuth, ValidateId, CancelRequest)

// Maintenance manager operations
requestsRouter.get('/getpendingrequests', isAuth,  GetPendingRequests)
requestsRouter.patch('/claim/:id', isAuth, ValidateId, ClaimRequest)
requestsRouter.patch('/approve/:id', isAuth, ValidateId, ApproveRequest)
requestsRouter.patch('/reject/:id', isAuth, ValidateId, RejectRequest)
requestsRouter.patch('/schedule/:id', isAuth, ValidateId, ScheduleRequest)
requestsRouter.patch('/assign/:id', isAuth, ValidateId, AssignTechnician)
requestsRouter.get('/myreviews', isAuth, GetMyReviews)

// Technician operations
requestsRouter.get('/myassignments', isAuth, GetMyAssignments)
requestsRouter.patch('/start/:id', isAuth, ValidateId, StartIntervention)
requestsRouter.patch('/complete/:id', isAuth, ValidateId, CompleteIntervention)

// Communication
requestsRouter.post('/comment/:id', isAuth, ValidateId, AddComment)

module.exports = requestsRouter