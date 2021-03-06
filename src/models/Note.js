import { Schema, model } from 'mongoose';

const NoteSchema = new Schema({
  title: String,
  body: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

NoteSchema.index({ title: 'text', body: 'text' });
export default model('Note', NoteSchema);
