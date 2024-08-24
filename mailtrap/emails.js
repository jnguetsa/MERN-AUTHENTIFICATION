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

const sendMailwelcome = async (email, name) => {
  const recipients = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      template_uuid: "052cc89b-af1c-4ed7-924e-a976d1aecc27",
      template_variables: {
        company_info_name: "Test_Company_info_name",
        name: name,
      },
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Erreur ", error);
  }
};
const sendMailforgotPwd = async (email, resetURL) => {
  const recipients = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Reset your password",
      html: MODELE_DEMANDE_REINITIALISATION_MOT_DE_PASSE.replace(
        "{resetURL}",
        resetURL
      ),
      category: "password-reset-email",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Erreur ", error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'envoi de l'email" + error.message });
  }
};
const sendResetsuccess = async (email) => {
  const recipients = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Reset your password",
      html: MODELE_DEMANDE_REINITIALISATION_MOT_DE_PASSE,
      category: "password-reset-email",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Erreur ", error);
  }
};
module.exports = {
  sendEmail,
  sendMailwelcome,
  sendMailforgotPwd,
  sendResetsuccess,
};
