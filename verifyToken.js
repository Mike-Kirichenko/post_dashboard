const { AuthenticationError } = require("apollo-server-errors");
const jwt = require("jsonwebtoken");

const verifyToken = (req, res) => {
  const { headers } = req;

  if (!headers.authorization) {
    throw new AuthenticationError("No Authorization header passed");
  }

  const [type, token] = headers.authorization.split(" ");

  if (type !== "Bearer" || !token) {
    throw new AuthenticationError("Incorrect token or no token passed");
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    return req;
  } catch (err) {
    throw new AuthenticationError("Invalid authorization info");
  }
};

module.exports = verifyToken;
