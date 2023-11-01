const express = require('express');
const router = express.Router();

// authentication and authorization controllers
const {login, signup, logout} = require('../controllers/Auth');
const {auth, isManager, isAdmin, isVisitor} = require('../middlewares/auth');

// manager controllers
const {getData,  updateRecord, getAttachments} = require('../controllers/Manager');

// admin controllers
const {getAllUsers, updateUserRole} = require('../controllers/Admin');

// visitor controllers
const {searchRecordByMail, uploadAttachment} = require("../controllers/Visitor");


// login, signup, logout routes
router.post('/login', login);
router.post('/logout', auth, logout);

// manager routes
router.get('/getData', auth, isManager,  getData);
router.get('/getAttachments/:recordId', auth, isManager, getAttachments);

router.put('/updateRecord/update/:leadId', auth, isManager, updateRecord);

// admin routes
router.get('/getAllUsers', auth, isAdmin, getAllUsers);
router.put('/updateUserRole/:id', auth, isAdmin, updateUserRole);

// visitor routes
router.post('/createZohoLead', auth, isVisitor, searchRecordByMail, uploadAttachment);


router.get('/', (req, res) => {
    console.log("Welcome");
    res.json({
        message: "Welcome",
        status: "Success"
    })
})



module.exports = router;