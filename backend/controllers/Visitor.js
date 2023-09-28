const axios = require("axios");
const path = require("path");
const FormData = require("form-data");
const fs = require("fs");

let access_token = "1000.68d80869390a47c8a582800b66be67c3.5a9298321c52ff85ffe2adbe3abfd03f";

function getZohoAccessToken() {
    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.83a3b549f4714729ad3d8290863d273a.bcdd3b018062df5458344a862f79d81a&client_id=1000.G73LKHN42126L4O4L6AGP0Y57B48UA&client_secret=b24d8b4b3a7fe61ca795fa59d29c28af2c3d578223&grant_type=refresh_token",
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

// search
exports.searchRecordByMail = async (req, res, next) => {
    await getZohoAccessToken();
    const mail = req.body.email;

    const config = {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${access_token}`
        },
        url: `https://www.zohoapis.com/crm/v5/Leads/search?email=${mail}`,
    }

    const response = await axios.request(config);
    const recordId = await response?.data?.data?.[0]?.id;


    // If record doesn't exist then create a new record
    if (!recordId) {
        try {
            const { name, email, phone } = req.body;
            console.log("Received Data -->", name, email, phone);

            // newlead fields
            const newLead = [
                {
                    Lead_Source: "Custom app",
                    Company: name,
                    Last_Name: name,
                    Email: email,
                    Phone: phone,
                },
            ];

            // options
            const config = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                url: `https://www.zohoapis.com/crm/v2/Leads`,
                data: {
                    data: newLead,
                }
            }

            // creating new lead/record
            const response = await axios.request(config);
            const data = await response.data.data[0];
            console.log('created lead', data);

            // calling next middleware after attaching recordId
            const recordId = data?.details?.id
            console.log("recordId", recordId);
            req.recordId = recordId;
            next();
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: 'error creating new Record'
            });
        }
    }

    // If record already exists, attach record Id with req. object
   else{
     // calling next middleware after attaching recordId
     req.recordId = recordId;
     next();
   }
}

exports.uploadAttachment = async (req, res) => {
    try {
        const recordId = req.recordId;
        const file = req.files.file;

        // creating path where file will be stored
        const uploadPath = path.resolve(__dirname, "../docs", file.name);
        console.log("uploadPath", uploadPath);

        // saving file on server
        await file.mv(uploadPath, function (err) {
            if (err) {
                return res.status(500).send(err);
            }
        });
        console.log("file saved on the server");

        // creating formData 
        const fileData = new FormData();
        fileData.append('file', fs.createReadStream(uploadPath));
        fileData.append('title', file.name);

        // options
        const config = {
            method: "POST",
            maxBodyLength: Infinity,
            headers: {
                'Authorization': `Bearer ${access_token}`,
                ...fileData.getHeaders()
            },
            url: `https://www.zohoapis.com/crm/v5/Leads/${recordId}/Attachments`,
            data: fileData
        }

        console.log("here");

         // uploading file to CRM
        setTimeout(async () => {
                const responsee = await axios.request(config);
                const data = await responsee?.data?.data?.[0];
                console.log("response after uploading file", data);

                console.log("there");

                res.status(200).json({
                    success: false,
                    message: "document uploaded successfully"
                });
        }, 100);
    }

    catch (err) {
        console.log("error -->", err);
        res.status(400).json({
            success: false,
            message: "error uploading document"
        });
    }
}