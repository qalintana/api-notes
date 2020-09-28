import { Router } from 'express';

import Note from '../models/Note';

import { WithAuth } from '../middlewares/auth';

const router = Router();

// *criar a nota de acordo com o usuario
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

router.get('/', WithAuth, async (req, res) => {
  try {
    let notes = await Note.find({ author: req.user._id });
    return res.json(notes);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.get('/search', WithAuth, async (req, res) => {
  const { query } = req.query;
  try {
    let notes = await Note.find({ author: req.user._id }).find({
      $text: { $search: query },
    });

    return res.json(notes);
  } catch (error) {
    return res.json({ error }).status(500);
  }
});

router.get('/:id', WithAuth, async (req, res) => {
  try {
    const { id } = req.params;
    let note = await Note.findById(id);

    if (isOwner(req.user, note)) {
      return res.json(note);
    }
    return res.status(403).json({ error: 'Permission denied' });
  } catch (error) {
    return res.status(500).json({ error: 'Problem to get a note' });
  }
});

router.put('/:id', WithAuth, async (req, res) => {
  const { title, body } = req.body;
  const { id } = req.params;

  let note = await Note.findById(id);

  if (isOwner(req.user, note)) {
    note = await Note.findByIdAndUpdate(
      id,
      {
        $set: { title, body },
      },
      { upsert: true, new: true }
    );
    return res.json(note);
  } else {
    return res.status(403).json({ error: 'Permission denied' });
  }
});

router.delete('/:id', WithAuth, async (req, res) => {
  try {
    const { id } = req.params;
    let note = await Note.findById(id);

    if (isOwner(req.user, note)) {
      await note.deleted();
      return res.json({ message: 'Deleted' }).status(204);
    }

    return res.status(403).json({ error: 'Permission denied' });
  } catch (error) {
    return res.status(500).json({ error: 'Problem to get a note' });
  }
});

const isOwner = (user, note) => {
  if (!JSON.stringify(user._id) === JSON.stringify(note.author.id)) {
    return false;
  }
  return true;
};

export default router;
