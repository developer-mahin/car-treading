import { TAuthUser } from '../../interface/authUser';
import QueryBuilder from '../../QueryBuilder/queryBuilder';
import { TSubmitListing } from './submitListing.interface';
import SubmitListing from './submitListing.model';

const createSubmitListing = async (
  payload: Partial<TSubmitListing>,
  user: TAuthUser,
) => {
  const result = await SubmitListing.create({
    ...payload,
    userId: user.userId,
  });
  return result;
};

const getSubmitListing = async (query: Record<string, unknown>) => {
  const submitListingQuery = new QueryBuilder(SubmitListing.find(), query)
    .paginate()
    .sort();
  const result = await submitListingQuery.queryModel;
  const pagination = await submitListingQuery.countTotal();
  return { pagination, result };
};

export const SubmitListingService = {
  createSubmitListing,
  getSubmitListing,
};
