const express = require('express');
const router = express.Router();
const FormData = require('form-data');

// 
const axios = require('axios');

// authentication and authorization controllers
const { login, signup, logout } = require('../controllers/Auth');
const { auth, isManager, isAdmin, isVisitor } = require('../middlewares/auth');

// manager controllers
const { getData, updateRecord, getAttachments } = require('../controllers/Manager');

// admin controllers
const { getAllUsers, updateUserRole } = require('../controllers/Admin');

// visitor controllers
const { searchRecordByMail, uploadAttachment } = require("../controllers/Visitor");


// login, signup, logout routes
router.post('/login', login);
router.post('/logout', auth, logout);

// manager routes
router.get('/getData', auth, isManager, getData);
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


router.post('/update1', async (req, res) => {
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
            "https://www.zohoapis.com/crm/v2/functions/addDataToCarLoan1/actions/execute?auth_type=apikey&zapikey=" + zapikey;
        const response = await axios.post(URL, finalPostData);
        console.log(response.data)
        res.json({ data: response.data });
    } catch (error) {
        res.json({ error: error.message });
    }
});


router.post('/update2', async (req, res) => {
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
            "https://www.zohoapis.com/crm/v2/functions/addDataToCarLoan2/actions/execute?auth_type=apikey&zapikey=" + zapikey;
        const response = await axios.post(URL, finalPostData);
        console.log(response.data)
        res.json({ data: response.data });
    } catch (error) {
        res.json({ error: error.message });
    }
})


// ////////// Dialabank
const Imap = require('imap');
const fs = require('fs');
// const axios = require('axios');
const { promisify } = require('util');
const { exit } = require('process');
const asyncForEach = require('async-foreach').forEach;

router.post('/dialabank', async (req, res) => {
    try{
        const host = 'mail.paisso.com';
        const username = 'cv@paisso.com';
        const password = 'Chdchd@2023';
        const downloadFolder = '';
    
        let authToken = '';
    
        const imap = new Imap({
            user: username,
            password: password,
            host: host,
            port: 993, // IMAP over SSL
            tls: true,
            tlsOptions: { rejectUnauthorized: false }, // Accept self-signed certificates (use with caution)
        });
    
        const refreshTokenUrl = 'https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.74e9037d36c4f35901fe2b1ac2e83f4c.ce52c31004906e9da2f1a112adbf3d90&client_id=1000.L5HO0IZ9EZYJ8XYVD82CX1C2X4ULII&client_secret=76e908f97ec649fdeed02c85514592d63f013b8fcf&grant_type=refresh_token';
    
        async function getAuthToken() {
            try {
                const response = await axios.post(refreshTokenUrl);
                return response.data.access_token;
            } catch (error) {
                console.error('Error getting access token:', error.message);
                return null;
            }
        }
    
        async function openInbox(cb) {
    
            authToken = await getAuthToken();
            console.log(authToken);
            imap.openBox('INBOX', true, cb);
        }
    
        imap.once('ready', () => {
            openInbox((err, box) => {
                if (err) throw err;
                const checkDate = new Date();
                checkDate.setDate(checkDate.getDate() - 30);
    
    
                const searchCriteria1 = [
                    ['SUBJECT', 'Indeed:'],
                    ['SENTSINCE', '1-Nov-2023'],
    
                ];
    
                //   imap.search([['FROM', 'tfortest100@gmail.com']]
    
                imap.search(searchCriteria1, (err, searchResults) => {
                    if (err) throw err;
    
                    asyncForEach(searchResults, (messageNumber, index, done) => {
                        const fetch = imap.fetch(messageNumber, { bodies: '' });
                        fetch.on('message', (msg) => {
                            msg.on('body', (stream, info) => {
                                let message = '';
                                stream.on('data', (chunk) => {
                                    message += chunk.toString('utf8');
                                });
    
                                stream.once('end', () => {
                                    // console.log(message);
    
                                    const parts = message.split('&id=');
                                    // console.log(parts);
    
                                    if (parts.length > 1) {
    
                                        // const messageStr = parts[1].split('email-application');
                                        // console.log(parts);
    
    
                                        // const fs = require('fs'); 
    
                                        const data = parts[1];
                                        const test_data = parts[0].split("applied for ");
                                        const job_post = test_data[1].split("&amp");
    
                                        let data1 = data;
    
                                        let data2 = data1.split('"');
    
                                        let data3 = data2[0];
    
                                        let data4 = data3.split("3D");
    
                                        let data5 = data4[1].replace('\n', '');
    
                                        data5 = data5.replace('\n', '');
    
                                        data5 = data5.replace('=', '');
    
                                        console.log(data5);
    
                                        data5 = data5 + "3D";
    
                                        createRecord(data5, job_post[0].substring(0, 18));
                                    }
                                });
                            });
    
                            msg.once('end', () => console.log("done"));
                        });
                    });
                });
    
                imap.once('end', () => {
                    console.log('Connection ended');
                });
            });
        });
    
        imap.once('error', (err) => {
            console.log(err);
        });
    
        imap.connect();
    
    
        const createRecord = async (resume_url, job_post) => {
            // const refreshTokenUrl = 'https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.74e9037d36c4f35901fe2b1ac2e83f4c.ce52c31004906e9da2f1a112adbf3d90&client_id=1000.L5HO0IZ9EZYJ8XYVD82CX1C2X4ULII&client_secret=76e908f97ec649fdeed02c85514592d63f013b8fcf&grant_type=refresh_token';
            const zohoCreateRecordUrl = 'https://www.zohoapis.com/crm/v2.1/Zoho_Recruit';
    
            // async function getAuthToken() {
            //     try {
            //         const response = await axios.post(refreshTokenUrl);
            //         return response.data.access_token;
            //     } catch (error) {
            //         console.error('Error getting access token:', error.message);
            //         return null;
            //     }
            // }
    
            async function zoho_crm_create_record() {
    
    
                if (!authToken) {
                    console.error('Access token is not available. Cannot create record.');
                    return;
                }
    
                const recordObject = {
                    Name: new Date().toString(),
                    Resume_ID: resume_url,
                    Job_Post: job_post // Replace with your actual body
                };
    
                const requestBody = {
                    data: [recordObject],
                };
    
                try {
                    const response = await axios.post(zohoCreateRecordUrl, requestBody, {
                        headers: {
                            Authorization: `Zoho-oauthtoken ${authToken}`,
                        },
                    });
    
                    console.log('Response headers:', response.headers);
                    console.log('Response data:', response.data);
                    console.log('HTTP status code:', response.status);
                } catch (error) {
                    console.error('Error creating Zoho record:', error.message);
                  
                }
            }
    
            zoho_crm_create_record(resume_url);


        }

        return res.json({
            message: "success",
        })
    }
    catch(error){
        return res.json({
            message: "error",
            error: error.message
        })
    }

})

module.exports = router;