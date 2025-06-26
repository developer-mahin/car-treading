import { model, Schema } from 'mongoose';
import { TProfile } from './profile.interface';

const profileSchema = new Schema<TProfile>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    first_name: { type: String },
    last_name: { type: String },
    phoneNumber: { type: String },
    profileImage: { type: String },
    cvrNumber: { type: String },
    address: { type: String },
    city: { type: String },
    street: { type: String },
    zip: { type: String },
    websiteLink: { type: String },
    regNo: { type: String },
    kontoNr: { type: String },
    companyLogo: { type: String },
    companyName: { type: String },
  },
  {
    timestamps: true,
  },
);

const Profile = model<TProfile>('Profile', profileSchema);
export default Profile;
