const fs = require("fs");
const axios = require("axios");

exports.getAccessToken = async () => {
    try {
        // reading file Data
        const readFile = fs.readFileSync("accessToken.txt", "utf-8");
        const fileData = JSON.parse(readFile);
        const storedTime = new Date(fileData.expiresAt);
        // console.log("fileData", fileData);

        // runs when token expires or doesn't exist
        if (
            new Date().getTime() > storedTime.getTime() ||
            fileData.token === "" ||
            fileData.token === undefined ||
            fileData.expiresAt === "" ||
            fileData.expiresAt === undefined
        ) {
            // adding 55 minutes to current time
            var d = new Date();
            d.setMinutes(d.getMinutes() + 55);

            // generating ZOHO access token
            const response = await axios.post(
                "https://accounts.zoho.com/oauth/v2/token",
                {},
                {
                    params: {
                        refresh_token: "1000.0e412b3f237b1c390f52e48777b4c2e6.7c23f019ec1aabc40ab24867279c3262",
                        client_id: "1000.F6UPW5CFBJY0JEOR5H2T5D0I9S1OWL",
                        client_secret: "36660c4d98a43e569897ac6f4b6ea2e8e0c49be149",
                        grant_type: "refresh_token",
                    },
                }
            );

            const newToken = response.data.access_token;

            // Storing Token in accessToken.txt file
            fs.writeFileSync(
                "accessToken.txt",
                JSON.stringify({
                    token: newToken,
                    expiresAt: d,
                }, null, 2),
                "utf8"
            );

            console.log("New token", newToken);
            return newToken;
        } 
        // runs when token exist and expires
        else {
            console.log("fileData", fileData);
            return fileData.token;
        }
    } catch (err) {
        console.log(err);
        return err.message;
    }
};

