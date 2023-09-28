const express = require('express');
const router = express.Router();

// authentication and authorization controllers
const {login, signup, logout} = require('../controllers/Auth');
const {auth, isManager, isAdmin, isVisitor} = require('../middlewares/auth');
// manager controllers
const {getData, approveRecord, rejectRecord, updateRecord} = require('../controllers/Manager');
// admin controllers
const {getAllUsers, updateUserRole} = require('../controllers/Admin');
// visitor controllers
const {searchRecordByMail, uploadAttachment} = require("../controllers/Visitor");


// login, signup, logout routes
router.post('/login', login);
router.post('/signup', signup);
router.post('/logout', auth, logout);

// manager routes
router.get('/getData', auth, isManager, getData);
// router.put('/updateRecord/approve/:leadId', auth, isManager, approveRecord);
// router.put('/updateRecord/reject/:leadId', auth, isManager, rejectRecord);
router.put('/updateRecord/update/:leadId', auth, isManager, updateRecord);

// admin routes
router.get('/getAllUsers', auth, isAdmin, getAllUsers);
router.put('/updateUserRole/:id', auth, isAdmin, updateUserRole);

// visitor routes
router.post('/createZohoLead', auth, isVisitor, searchRecordByMail, uploadAttachment);



module.exports = router;