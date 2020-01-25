const express = require("express");
const routes = require("./public/routing/htmlRoutes.js");
const PORT = process.env.PORT || 8080;
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const xoauth2 = require('xoauth2')
const { google } = require("googleapis");
const dotenv = require("dotenv").config();
const OAuth2 = google.auth.OAuth2;
const mg = require("nodemailer-mailgun-transport")


app.use(express.static(path.join(__dirname, '/public')))



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(routes);

const MG_USER = process.env.MG_USER;
const MG_API = process.env.MG_API;
const EMAIL = process.env.EMAIL;

// const oauth2Client = new OAuth2(
//   ID,
//   Secret,
//   "https://developers.google.com/oauthplayground" 
// );

// oauth2Client.setCredentials({
//   refresh_token: RefreshToken
// });

// const accessToken = oauth2Client.getAccessToken()

app.post('/send', (req, res) =>{
  const output = `
    <p> You have a new contact request</p>
    <h3> Contact Details</h3>
    <ul>
    <li>Name: ${req.body.name}</li>
    <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;


// let smtpTrans = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//       type: 'OAuth2',
//       user: GMAIL_USER,
//       clientId: ID,
//       clientSecret: Secret,
//       refreshToken: RefreshToken, 
//       accessToken: accessToken
//       }
       
//   });
const mgAuth = {
  auth: {
    api_key: MG_API,
    domain: "mail.smartmichalski.com"
  }
}

let smtpTrans = nodemailer.createTransport(mg(mgAuth))

// setup email data with unicode symbols
let mailOpts = {
    from: MG_USER,
    to: EMAIL, 
    subject: 'Portfolio Form', 
    generateTextFromHTML: true, 
    html: output 
};

// send mail with defined transport object
smtpTrans.sendMail(mailOpts, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log(mailOpts);
    console.log('Message sent: %s', info.messageId);   
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.render('contact', {msg:'Email has been sent'});
});
});

app.listen(PORT, function() {
 
  console.log("Server listening on: http://localhost:" + PORT);
});