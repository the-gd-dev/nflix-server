const jwt = require("jsonwebtoken");

const config = process.env;

const isAuthenticated = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ status: 403, message: "Invalid Token." });
  }
  try {
    const decoded = jwt.verify(token.trim(), config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({ status: 401, message: "Unauthorised." });
  }
  return next();
};

module.exports = isAuthenticated;
