import { Router } from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/User';

const SECRET = process.env.JWT_TOKEN;

const router = Router();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });

  try {
    const savedUser = await user.save();

    return res.json(savedUser).status(201);
  } catch (error) {
    return res.status(500).json({ error: 'Error registering new User' });
  }
});

router.post('/login', async function (req, res) {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Incorrect email ou password' });
    } else {
      user.isCorrectPassword(password, function (error, same) {
        if (!same) {
          return res.status(401).json({ error: 'Incorrect email ou password' });
        } else {
          const token = jwt.sign({ email }, SECRET, {
            expiresIn: '7d',
          });
          return res.json({ token, user });
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Error, please try again' });
  }
});

export default router;
