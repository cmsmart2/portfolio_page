const express = require("express");
const routes = require("./public/routing/htmlRoutes.js");
const PORT = process.env.PORT || 8080;
const path = require("path");
const app = express();
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const xoauth2 = require('xoauth2')
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;


app.use(express.static(path.join(__dirname, '/public')))



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(routes);

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;
const ID = process.env.ID;
const Secret = process.env.Secret;
const RefreshToken = process.env.RefreshToken;

const oauth2Client = new OAuth2(
  ID,
  Secret,
  "https://developers.google.com/oauthplayground" 
);

oauth2Client.setCredentials({
  refresh_token: RefreshToken
});

const accessToken = oauth2Client.getAccessToken()

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


let smtpTrans = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      type: 'OAuth2',
      user: GMAIL_USER,
      clientId: ID,
      clientSecret: Secret,
      refreshToken: RefreshToken, 
      accessToken: accessToken
      }
       
  });

// setup email data with unicode symbols
let mailOpts = {
    from: "Nodemailer Contact",
    to: GMAIL_USER, 
    subject: 'Portfolio Form', 
    generateTextFromHTML: true, 
    html: output 
};

// send mail with defined transport object
smtpTrans.sendMail(mailOpts, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);   
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.render('contact', {msg:'Email has been sent'});
});
});

app.listen(PORT, function() {
 
  console.log("Server listening on: http://localhost:" + PORT);
});