const axios = require('axios');
// for file upload
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');


let access_token = "";
let users_access_token = "";

// Generates Access Token using refresh Token
function getZohoAccessToken() {
    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.0e412b3f237b1c390f52e48777b4c2e6.7c23f019ec1aabc40ab24867279c3262&client_id=1000.F6UPW5CFBJY0JEOR5H2T5D0I9S1OWL&client_secret=36660c4d98a43e569897ac6f4b6ea2e8e0c49be149&grant_type=refresh_token",
    };

    return axios
        .request(config)
        .then((response) => {
            access_token = response.data.access_token; // Store the access token
            console.log("access token generated", access_token);
            return access_token;
        })
        .catch((error) => {
            throw error;
        });
}


// Get All leads from CRM
exports.getData = async (req, res) => {
    await getZohoAccessToken();

    const config = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        url: "https://www.zohoapis.com/crm/v2/CL"
    };

    axios.request(config)
        .then((result) => {
            const leads = result.data.data;
            console.log('fetched leads', leads);


            // filtering the leads
            // const data = leads.filter((lead) => {
            //     console.log("----", req.user.state.toLowerCase());
            //     console.log("state", lead.State1);
            //     return (lead?.State1?.toLowerCase() === req.user.state.toLowerCase());
            // })

            const data = leads;

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
    await getZohoAccessToken();

    const { leadId } = req.params;
    const {selectedValue} = req.body;

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

