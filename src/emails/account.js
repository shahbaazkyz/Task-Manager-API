const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const dotenv = require("dotenv");
dotenv.config();

const OAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
OAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const sendMail = async (email, name) => {
  try {
    const accesToken = await OAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAUTH2",
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accesToken,
      },
    });

    const mailOptions = {
      from: "<forfirebasekyz@gmail.com>",
      to: email,
      subject: "Thanks for joining us!",
      html: `<h1>Hello ${name}</h1> <br/> <p> Let me know how you get along with the app.  </p> `,
    };

    const result = transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    return "Email not sent.";
  }
};

const cancellationMail = async (email, name) => {
  try {
    const accesToken = await OAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAUTH2",
        user: process.env.EMAIL,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accesToken,
      },
    });

    const mailOptions = {
      from: "<forfirebasekyz@gmail.com>",
      to: email,
      subject: "Sorry to see you going!",
      html: `<h1>Goodbye,  ${name}</h1> <br/> <p> I hope to see you back sometime soon. </p> `,
    };

    const result = transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
};

// sendMail().then(result => console.log("email is sent ", result)).catch(e => console.log("email is not sent" , e))
module.exports = { sendMail, cancellationMail };
