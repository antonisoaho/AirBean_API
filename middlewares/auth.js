const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader)
    return res.status(403).send('A token is required for authentication');

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token)
    return res.status(401).send('Invalid authorization header format.');

  try {
    const KEY = process.env.JWT_KEY;
    const decoded = jwt.verify(token, KEY);

    req.user = {
      username: decoded.username,
      userId: decoded.userId,
    };
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    return res.status(401).send('Invalid token.');
  }
  return next();
};

module.exports = { auth };