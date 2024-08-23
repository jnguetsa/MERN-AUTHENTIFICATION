const { MailtrapClient } = require("mailtrap");
require("dotenv").config();
const {
  MODELE_EMAIL_VERIFICATION,
  MODELE_DEMANDE_REINITIALISATION_MOT_DE_PASSE,
  MODELE_REINITIALISATION_MOT_DE_PASSE_SUCCES,
} = require("./templateEmail.js");
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
      html: MODELE_EMAIL_VERIFICATION.replace(
        "{verificationCode}",
        verificationToken
      ), // Remplace par ton template HTML
      category: "verification-email",
    });
    console.log("Email sent", response);
  } catch (error) {
    console.error("Erreur ", error);
  }
};

module.exports = sendEmail;
