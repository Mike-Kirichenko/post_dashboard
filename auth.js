const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("./db/models");
const { SECRET_KEY } = process.env;

const genToken = (tokenParams) => {
  const token = jwt.sign(tokenParams, SECRET_KEY, {
    expiresIn: "24h"
  });
  return token;
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(422).send({ msg: "All inputs required" });

  try {
    const foundUser = await User.findOne({
      where: { email }
    });

    if (foundUser) {
      const passwordsMatch = await bcrypt.compare(password, foundUser.password);
      if (passwordsMatch) {
        const { id, email } = foundUser;
        const token = genToken({ id, email });
        req.user = foundUser;
        return res.send({ email, token });
      }
    }
    return res.status(401).send({ msg: "Invalid Credentials" });
  } catch (err) {
    return res.status(422).send({ msg: err.message });
  }
};
