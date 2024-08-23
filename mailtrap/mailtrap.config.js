const { MailtrapClient } = require("mailtrap");
require("dotenv").config();

const TOKEN = process.env.MAILTRAP_TOKEN;
const ENDPOINT = process.env.MAILTRAP_ENDPOINT;

const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "jniornoumedem",
};

// const sendEmail = async (userEmail, verificationToken) => {
//   try {
//     const response = await client.send({
//       from: sender,
//       to: [{ email: userEmail }],
//       subject: "Verification Email",
//       text: `Your verification token is: ${verificationToken}`,
//     });
//     console.log("Email sent:", response);
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw new Error("Error sending email: " + error.message);
//   }
// };

module.exports = { client, sender };
