import mongoose, {HydratedDocument} from 'mongoose';
import bcrypt from 'bcrypt';
import {randomUUID} from 'node:crypto';
import {UserFields, UserMethods, UserModel} from '../types';

const SALT_WORK_FACTOR = 10

const Schema = mongoose.Schema;
const UserSchema = new Schema<UserFields, UserModel, UserMethods>({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,5})+$/, 'Please fill a valid email address'],
    validate: {
      validator: async function (value: string): Promise<boolean> {
        if (!(this as HydratedDocument<UserFields>).isModified('email')) {
          return true;
        }
        const user = await User.findOne({email: value});
        return !user;
      },
      message: 'This user is already registered!',
    }
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'user',
    enum: ['user', 'admin'],
  },
  displayName: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  googleID: String,
});

UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
}

UserSchema.methods.generateToken = function () {
  this.token = randomUUID();
}

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  }
});

const User = mongoose.model<UserFields, UserModel>('User', UserSchema);

export default User;