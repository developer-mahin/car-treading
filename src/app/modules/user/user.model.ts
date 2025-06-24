/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';
import { USER_ROLE, USER_STATUS } from '../../constant';
import { IUser, UserModel } from './user.interface';

export const userSchema = new mongoose.Schema<IUser, UserModel>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    uuid: {
      type: String,
      required: [true, 'UUID is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters long'],
      select: 0,
    },
    profile: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLE),
      default: USER_ROLE.private_user,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.active,
    },
    isTaskAssigned: {
      type: Boolean,
      default: false,
    },
    isSocialLogin: {
      type: Boolean,
      default: false,
    },
    needPasswordChange: {
      type: Boolean,
      default: false,
    },
    isUseTransport: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isPrivacyAccepted: {
      type: Boolean,
      default: false,
    },
    isTermAccepted: {
      type: Boolean,
      default: false,
    },
    isTransportAdd: {
      type: Boolean,
      default: false,
    },
    privacyDate: {
      type: String,
    },
    termsDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// query middlewares
userSchema.pre('find', async function (next) {
  const query = this as any;

  if (query.options.bypassMiddleware) {
    return next(); // Skip middleware if the flag is set
  }
  this.find({
    $and: [{ isDeleted: { $ne: true } }, { isBlocked: { $ne: true } }],
  });
  next();
});

userSchema.pre('findOne', async function (next) {
  const query = this as any;

  if (query.options.bypassMiddleware) {
    return next(); // Skip middleware if the flag is set
  }
  this.findOne({
    $and: [{ isDeleted: { $ne: true } }, { isBlocked: { $ne: true } }],
  });
  next();
});

userSchema.pre('aggregate', async function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

userSchema.statics.findLastUser = async function () {
  return await this.findOne({}, null, { bypassMiddleware: true })
    .select('uuid')
    .sort({ createdAt: -1 })
    .limit(1)
    .lean();
};

userSchema.statics.isUserExist = async function (id: string) {
  return await User.findOne({ _id: id }).select('+password');
};

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; // doc
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  next();
});

userSchema.statics.isMatchedPassword = async function (password, hashPassword) {
  return await bcrypt.compare(password, hashPassword);
};
const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
