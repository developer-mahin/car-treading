/* eslint-disable @typescript-eslint/no-explicit-any */
import { TAuthUser } from '../../interface/authUser';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';
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
  const submitListingQuery = new AggregationQueryBuilder(query);
  const result = await submitListingQuery
    .customPipeline([
      {
        $match: {},
      },
    ])
    .filter(['fuel', 'mark'])
    .sort()
    .rangeFilterForModel(['modelsFrom', 'modelsTo'])
    .rangeFilterForDriven(['drivenKmFrom', 'drivenKmTo'])
    .execute(SubmitListing);

  const pagination = await submitListingQuery.countTotal(SubmitListing);

  return { pagination, result };
};

export const SubmitListingService = {
  createSubmitListing,
  getSubmitListing,
};
