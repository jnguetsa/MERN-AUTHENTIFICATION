const jwt = require("jsonwebtoken");
require("dotenv").config();
// module.exports = function generateToken(user) {
//   return jwt.sign(user, config.secret, {
//     expiresIn: 60 * 60 * 24 * 7, // 1 week
//   });
// };

const generateToken = (res, usern) => {
  const token = jwt.sign(usern, process.env.SECRET, {
    expiresIn: 60 * 60 * 24 * 7, // 1 week
  });
  res.status(200).json({ message: "Token Generated", token });
};

module.exports = generateToken;
