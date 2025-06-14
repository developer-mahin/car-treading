import { TAuthUser } from '../../interface/authUser';
import User from '../user/user.model';
import { TStaticContent } from './staticContent.interface';
import StaticContent from './staticContent.model';

const createStaticContent = async (
  user: TAuthUser,
  payload: Partial<TStaticContent>,
) => {
  const result = await StaticContent.findOneAndUpdate(
    { type: payload.type },
    {
      ...payload,
      userId: user.userId,
    },
    { upsert: true, new: true },
  );

  if (payload.type === 'terms-and-conditions') {
    await User.updateMany(
      { _id: { $ne: user.userId } },
      { $set: { isTermAccepted: false } },
    );
  } else if (payload.type === 'privacy-policy') {
    await User.updateMany(
      { _id: { $ne: user.userId } },
      { $set: { isPrivacyAccepted: false } },
    );
  }

  return result;
};

const getStaticContent = async (query: Record<string, unknown>) => {
  const result = await StaticContent.findOne({ ...query });
  return result;
};

export const StaticContentService = {
  createStaticContent,
  getStaticContent,
};
