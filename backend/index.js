const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
require('dotenv').config();
const path = require('path');

const PORT = process.env.PORT || 4000;

const app = express();
// app.use(cors());

// cookie parser
app.use(cookieParser());

// json parser
app.use(express.json());

// file upload
app.use(fileUpload(
  // {
  // useTempFiles: true,
  // tempFileDir: 'docs',
  // safeFileNames: true,
  // preserveExtension: 4 
// }
));

console.log("ddd", __dirname);

// for post request
app.use(express.urlencoded({ extended: true })); //to access form data


// Enable CORS with credentials and all origin for all apis
  app.use("*", cors({
    origin: true,
    credentials: true,
  }));

// /////////////////

// DB connection
require("./config/database").connect();

// mounting routes
const routes = require('./routes/routes');
app.use('/api/v1', routes);


app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`);
});
