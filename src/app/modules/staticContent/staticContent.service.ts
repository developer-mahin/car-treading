import { TAuthUser } from '../../interface/authUser';
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
