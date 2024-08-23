const { MailtrapClient } = require("mailtrap");
require("dotenv").config();

const TOKEN = process.env.MAILTRAP_TOKEN;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

const mailtrapClient = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "jniornoumedem",
};

const sendEmail = async (email, verificationToken) => {
  const recipients = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Verify your email",
      html: `Your verification code is: ${verificationToken}`, // Remplace par ton template HTML
      category: "verification-email",
    });
    console.log("Email sent", response);
  } catch (error) {
    console.error("Erreur ", error);
  }
};

module.exports = sendEmail;
