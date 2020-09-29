import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const result = await bcrypt.hash(this.password, 10);
    this.password = result;
    next();
    // bcrypt.hash(this.password, 10, (error, hashePassword) => {
    //   if (error) next(error);
    //   else {
    //     this.password = hashePassword;
    //     next();
    //   }
    // });
  }
});

UserSchema.methods.isCorrectPassword = async function (password, callback) {
  bcrypt.compare(password, this.password, function (error, same) {
    if (error) callback(error);
    else callback(error, same);
  });
};

export default model('User', UserSchema);
