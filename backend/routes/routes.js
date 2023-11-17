const express = require('express');
const router = express.Router();
const FormData = require('form-data');

// 
const axios = require('axios');

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


// garvit 
var zapikey = "1003.eec8614a7ccdc1ed88053beb3bae5b5e.e507e1d4b470523a54606c5e9809b86a";


router.post('/update1',async(req,res)=>{
    try {
        const data = req.body;
        console.log("data", data)
    
        function jsonToFormData(json) {
          const from = new FormData();
    
          for (const key in json) {
            
            if (json.hasOwnProperty(key)) {
                // console.log("object", key, json[key]);
              from.append(key, json[key]);
            }
          }
    
          return from;
        }
        const finalPostData = jsonToFormData(data);
        const URL =
        "https://www.zohoapis.com/crm/v2/functions/addDataToCarLoan1/actions/execute?auth_type=apikey&zapikey="+zapikey;
        const response = await axios.post(URL, finalPostData);
        console.log(response.data)
        res.json({ data: response.data });
      } catch (error) {
        res.json({ error: error.message });
      }
});


router.post('/update2',async(req,res)=>{
  try {
      const data = req.body;
  
      function jsonToFormData(json) {
        const from = new FormData();
  
        for (const key in json) {
          if (json.hasOwnProperty(key)) {
            from.append(key, json[key]);
          }
        }
  
        return from;
      }
      const finalPostData = jsonToFormData(data);
      const URL =
      "https://www.zohoapis.com/crm/v2/functions/addDataToCarLoan2/actions/execute?auth_type=apikey&zapikey="+zapikey;
      const response = await axios.post(URL, finalPostData);
      console.log(response.data)
      res.json({ data: response.data });
    } catch (error) {
      res.json({ error: error.message });
    }
})

module.exports = router;