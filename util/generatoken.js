const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.SECRET, {
    expiresIn: 60 * 60 * 24 * 7, // 1 semaine
  });
  return token;
};

module.exports = { generateToken };
