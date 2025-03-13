// test-sendgrid.js
require('dotenv').config({ path: './.env' }); // Load the .env file explicitly
const sgMail = require('@sendgrid/mail');

console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY); // Debug log
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'mouguha03@gmail.com', // Replace with your email
  from: 'funfiasta@gmail.com', // Must be verified in SendGrid
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

sgMail
  .send(msg)
  .then((response) => {
    console.log('Email sent successfully:', response);
  })
  .catch((error) => {
    console.error('SendGrid error:', error);
    if (error.response) {
      console.error('Response body:', JSON.stringify(error.response.body, null, 2));
    }
  });