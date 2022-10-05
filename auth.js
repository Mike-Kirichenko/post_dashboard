const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('./db/models');
const { SECRET_KEY } = process.env;

const genToken = (tokenParams) => {
  const token = jwt.sign(tokenParams, SECRET_KEY, {
    expiresIn: '24h',
  });
  return token;
};

module.exports.login = async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password)
    return res.status(422).send({ msg: 'All inputs required' });

  try {
    const foundUser = await User.findOne({
      where: { [Op.or]: [{ email: login }, { nickname: login }] },
    });

    if (foundUser) {
      const passwordsMatch = await bcrypt.compare(password, foundUser.password);
      if (passwordsMatch) {
        const { id, email, firstName, lastName, avatar } = foundUser;
        const token = genToken({ id, email, firstName, lastName, avatar });
        req.user = foundUser;
        return res.send({ email, token });
      }
    }
    return res.status(401).send({ msg: 'Invalid Credentials' });
  } catch (err) {
    return res.status(422).send({ msg: err.message });
  }
};
