import mongoose from 'mongoose';
import { TAuthUser } from '../../interface/authUser';
import unlinkImage from '../../utils/unlinkImage';
import User from '../user/user.model';
import { TProfile } from './profile.interface';
import Profile from './profile.model';

const getMyProfile = async (user: TAuthUser) => {
  const aggregationPipeline = [
    {
      $match: {
        _id: new mongoose.Types.ObjectId(String(user.userId)),
      },
    },
    {
      $lookup: {
        from: 'profiles',
        localField: '_id',
        foreignField: 'userId',
        as: 'profile',
      },
    },
    {
      $unwind: '$profile',
    },
  ];
  const result = await User.aggregate(aggregationPipeline);
  return result[0] || null;
};

const updateProfile = async (id: string, payload: Partial<TProfile>) => {
  const findProfile = await Profile.findOne({ _id: id });
  if (!findProfile) {
    throw new Error('Profile not found');
  }

  if (payload.profileImage) {
    if (findProfile.profileImage) {
      const path = `./${findProfile.profileImage}`;
      await unlinkImage(path as string);
    }
  }

  const result = await Profile.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

const editProfile = async (id: string, payload: Partial<TProfile>) => {
  const findProfile = await Profile.findOne({ _id: id });
  if (!findProfile) {
    throw new Error('Profile not found');
  }

  const result = await Profile.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

export const ProfileService = {
  updateProfile,
  getMyProfile,
  editProfile,
};
