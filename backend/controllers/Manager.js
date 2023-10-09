const axios = require('axios');
// for file upload
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const {getAccessToken} = require('../accessToken');


let access_token = "";

// // Generates Access Token using refresh Token
// function getZohoAccessToken() {
//     let config = {
//         method: "post",
//         maxBodyLength: Infinity,
//         url: "https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.0e412b3f237b1c390f52e48777b4c2e6.7c23f019ec1aabc40ab24867279c3262&client_id=1000.F6UPW5CFBJY0JEOR5H2T5D0I9S1OWL&client_secret=36660c4d98a43e569897ac6f4b6ea2e8e0c49be149&grant_type=refresh_token",
//     };

//     return axios
//         .request(config)
//         .then((response) => {
//             access_token = response.data.access_token; // Store the access token
//             console.log("response.data", response.data);
//             console.log("access token generated", access_token);
//             return access_token;
//         })
//         .catch((error) => {
//             throw error;
//         });
// }


// Get All leads from CRM
exports.getData = async (req, res) => {
    access_token = await getAccessToken();

    const config = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        url: "https://www.zohoapis.com/crm/v2/CL",
        params: {
            fields: "id,Name,Mobile,City_New1,Asset_Type,Loan_Amt_Rs_Lacs,Model,Lead_Status,CD_Primary,Attachments,State1,Lead_Date,Actual_Disb_Date,"
        }
    };

    axios.request(config)
        .then((result) => {
            const leads = result.data.data;
            console.log('fetched leads', leads[0]);

            // filtering the leads
            const data = leads.filter((lead) => {
                const states = req.user.state;
                console.log("user States --> ", states);

                let leadState = lead?.State1?.trim()?.toLowerCase();
                leadState = leadState ? leadState : '';
                console.log("lead State -->", leadState, "test");

                const leadStatus = lead?.Lead_Status?.trim().toLowerCase();


                return (states.find(state => {
                    // console.log("Check ->",state.trim().toLowerCase()===leadState);
                    return state.trim().toLowerCase() === leadState;
                }) && leadStatus === 'allocated' && !lead?.Actual_Disb_Date );
            })



            console.log("data", data)
            // leads.
            // const data = leads;

            // sending data to frontend
            res.status(200).json(data);
        })
        .catch((err) => {
            console.log('error ---------->', err);
            res.status(500).json(err);
        });
}


// update record
exports.updateRecord = async (req, res) => {
    // Generating access Token
    access_token = await getAccessToken();

    const { leadId } = req.params;
    const { selectedValue } = req.body;

    console.log("leadId and selectedValue -->", leadId, selectedValue);

    const updatedData = [
        {
            id: leadId,
            CD_Primary: selectedValue.trim()
        }
    ];


    const config = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        url: `https://www.zohoapis.com/crm/v2/CL/${leadId}`,
        data: {
            data: updatedData
        }
    };

    axios.request(config)
        .then((result) => {
            const data = result.data.data;
            console.log('fetched data', data);

            res.status(200).json({
                success: true,
                message: 'Record Updated'
            });
        })
        .catch((err) => {
            console.log('error ---------->', err);
            res.status(500).json({
                success: false,
                message: 'Error updating record'
            });
        });

}

// getAttachments
exports.getAttachments = async (req, res) => {
    access_token = await getAccessToken();

    const { recordId } = req.params;
    console.log("getAttachments running");
    const config = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        url: `https://www.zohoapis.com/crm/v5/CL/${recordId}/Attachments?fields=id,File_Name,$file_id`
    };

    // first get list of attachments
    axios.request(config)
        .then((result) => {
            const attachments = result.data.data;
            console.log('fetched attachments', attachments);

            if (!attachments || attachments.length === 0) {
                return res.json({
                    message: 'This record has no attachments'
                })
            }

            let filesUrl = [];
            attachments.forEach((attachment) => {
                console.log(attachment.id, attachment.File_Name);
                console.log(`https://www.zohoapis.com/crm/v5/CL/${recordId}/Attachments/${attachment.id}`);
                const config = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${access_token}`
                    },
                    url: `https://www.zohoapis.com/crm/v5/CL/${recordId}/Attachments/${attachment.id}`,
                }


                axios.request(config)
                    .then((res) => {
                        console.log("res", res.data);
                        // const path = "file.txt";

                        const baseUrl = path.join(__dirname, '/files/');

                        const filePath = path.join(baseUrl, `${attachment.id}.txt`);
                        console.log("filePath", filePath);


                        fs.writeFileSync(filePath, res.data, 'utf8', (err) => {
                            if (err) {
                                console.error('Error writing to file:', err);
                            } else {
                                console.log('Data has been written to the file successfully.');
                                filesUrl.filePath = filePath;
                            }
                        });
                    })
                    .catch((err) => console.log("err", err))
            });






            // sending data to frontend
            res.status(200).json(filesUrl);
        })
        .catch((err) => {
            console.log('error ---------->', err);
            res.status(500).json(err);
        });
}

