import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import uuid from 'node-uuid';

const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function genUUID() {
        return uuid.v1();
      },
    },

    name: {
      type: String,
      require: true,
    },

    email: {
      type: String,
      require: true,
      lowercase: true,
      unique: true,
    },

    password: {
      type: String,
    },

    phone: {
      ddd: { type: Number, require: true },
      number: { type: Number, unique: true, require: true },
    },

    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const pass = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, pass);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.validatePassword = async function validatePassword(data) {
  return bcrypt.compare(data, this.password);
};

mongoose.model('User', UserSchema);

export default mongoose.model('User', UserSchema);
