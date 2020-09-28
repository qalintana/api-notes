import { Router } from 'express';

import Note from '../models/Note';

import { WithAuth } from '../middlewares/auth';

const router = Router();

router.post('/', WithAuth, async (req, res) => {
  const { title, body } = req.body;

  let note = new Note({ title, body, author: req.user._id });
  try {
    await note.save();
    return res.json(note);
  } catch (error) {
    return res.status(500).json({ error: 'Problem to create a new note' });
  }
});

export default router;
