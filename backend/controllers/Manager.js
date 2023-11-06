const axios = require('axios');
// for file upload
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { getAccessToken } = require('../accessToken');

let next_page_token = "false";


let access_token = "";

// gagandeepgoyal@gmail.com
// Gagan@CarDekho#1234

// Get All leads from CRM
exports.getData = async (req, res) => {
    // Generating access Token
    access_token = await getAccessToken();

    // ///
    let finalData = [];
    let pageToken = false;


    const getBulkRead = async () => {
        access_token = await getAccessToken();

        let config = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            url: "https://www.zohoapis.com/crm/v5/CL",
            params: {
                fields: `id,Name,Mobile,City_New1,Asset_Type,Loan_Amt_Rs_Lacs,Model,Lead_Status,CD_Primary,Attachments,State1,Lead_Date,Actual_Disb_Date,CD_SM_Name`
            }
        };


        console.log("outside if", pageToken);
        if (pageToken) {
            console.log("inside if");

            config.params.page_token = pageToken;
        }

        console.log(config);
        await axios.request(config)
            .then((result) => {
                const leads = result.data.data;
                console.log('fetched leads', leads[0], leads.length);
                next_page_token = result.data.info.next_page_token;
                console.log("next_page_token", next_page_token)

                if (next_page_token) {
                    pageToken = next_page_token;
                }

                console.log("pageToken", pageToken);


                // filtering the leads
                const data = leads.filter((lead) => {
                    const states = req.user.state;
                    // console.log("user States --> ", states);

                    let leadState = lead?.State1?.trim()?.toLowerCase();
                    leadState = leadState ? leadState : '';
                    // console.log("lead State -->", leadState, "test");

                    const leadStatus = lead?.Lead_Status?.trim().toLowerCase();

                    let cdSmName = lead?.CD_SM_Name ? lead.CD_SM_Name?.trim().toLowerCase() : '';

                    const allowedCdPrimaryValues = ['approved', 'disbursed', 'docs processing', 'follow up', 'logged in', 'pending feedback', 'rejected'];

                    const cdPrimary = lead?.CD_Primary?.toLowerCase()?.trim();

                    const allowedCdPrimary = allowedCdPrimaryValues.includes(cdPrimary);



                    // console.log("allowedCdPrimary", allowedCdPrimary);

                    // return (states.find(state => {
                    //     // console.log("Check ->",state.trim().toLowerCase()===leadState);
                    //     return state.trim().toLowerCase() === leadState;
                    // }) && leadStatus === 'allocated' && !lead?.Actual_Disb_Date && CD_SM_Name.includes('bhaskar'));

                    return (states.find(state => {
                        // console.log("Check ->",state.trim().toLowerCase()===leadState);
                        return state.trim().toLowerCase() === leadState;
                    }) && leadStatus === 'allocated' && allowedCdPrimary);
                })

                finalData = [...finalData, ...data];



                // console.log("data", data);


            })
            .catch((err) => {
                console.log('error ---------->', err);
                // res.status(500).json(err);
            });

    }

    for (let i = 0; i < 6; i++) {
        console.log("iterating", i)
        await getBulkRead();
    }

    console.log("finalData", finalData);
    // sending data to frontend
    res.status(200).json(finalData);

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

