const { password, username } = require('../test/payloads/user.payload');

const { signToken } = require('../utils/signToken');

const db = require('../db');

exports.getJWT = async () => {
  const user = await db.collection('Sellers').findOne({
    seller_id: username,
    seller_zip_code_prefix: password,
  });

  const token = signToken(user._id);

  return { token, userId: user._id };
};
