import { model, Schema } from 'mongoose';
import { TProfile } from './profile.interface';

const profileSchema = new Schema<TProfile>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    name: {
      type: String,
      trim: true,
    },
    contactNo: { type: String },
    profileImage: { type: String },
    facebook: { type: String },
    instagram: { type: String },
    queryCount: { type: Number, default: 0 },
    totalQuery: { type: Number, default: 0 },
    feedback: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

const Profile = model<TProfile>('Profile', profileSchema);
export default Profile;
