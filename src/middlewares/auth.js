import jwt from 'jsonwebtoken';
import User from '../models/User';

const SECRET = process.env.JWT_TOKEN;

export const WithAuth = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: no token provided' });
  } else {
    jwt.verify(token, SECRET, function (error, decode) {
      if (error) {
        return res
          .status(401)
          .json({ error: 'Unauthorized: no token provided' });
      } else {
        req.email = decode.email;
        User.findOne({ email: decode.email })
          .then((user) => {
            req.user = user;
            next();
          })
          .catch((error) => {
            return res.status(401).json({ error });
          });
      }
    });
  }
};
