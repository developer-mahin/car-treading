import mongoose from 'mongoose';
import { TAuthUser } from '../../interface/authUser';
import unlinkImage from '../../utils/unlinkImage';
import User from '../user/user.model';
import { TProfile } from './profile.interface';
import Profile from './profile.model';
import { USER_ROLE } from '../../constant';

const getMyProfile = async (user: TAuthUser) => {
  const aggregationPipeline = [];
  const matchStage = {
    $match: {
      _id: new mongoose.Types.ObjectId(user.userId),
    },
  };

  if (user.role === USER_ROLE.STAFF) {
    aggregationPipeline.push(
      {
        $lookup: {
          from: 'restaurants',
          localField: 'myRestaurant',
          foreignField: '_id',
          as: 'myRestaurant',
        },
      },
      { $unwind: '$myRestaurant' },
    );
  }

  aggregationPipeline.push(
    { ...matchStage },
    {
      $lookup: {
        from: 'profiles',
        localField: 'profile',
        foreignField: '_id',
        as: 'profile',
      },
    },
    { $unwind: '$profile' },
    {
      $project: {
        password: 0,
        myRestaurant: {
          staff: 0,
        },
      },
    },
  );

  const result = await User.aggregate(aggregationPipeline);
  return result;
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

export const ProfileService = {
  updateProfile,
  getMyProfile,
};
