/* eslint-disable @typescript-eslint/no-explicit-any */
import { USER_ROLE } from '../../constant';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';
import sendMail from '../../utils/sendMail';
import User from '../user/user.model';
import { TSubmitListing } from './submitListing.interface';
import SubmitListing from './submitListing.model';

const createSubmitListing = async (
  payload: Partial<TSubmitListing> | any,
) => {

  let createdUser
  if (!payload.userId) {
    createdUser = await User.create({
      email: payload.email,
      password: "hello123",
      role: USER_ROLE.private_user,
      first_name: payload.first_name,
      last_name: payload.last_name,
      phoneNumber: payload.phoneNumber,
      needPasswordChange: true
    });

    await sendMail({
      email: payload.email,
      subject: "Welcome to Car Trading",
      html: `
        <h3>Change Your Password Your Default Password is hello123</h3>
        `
    })
  }

  const result = await SubmitListing.create({
    ...payload,
    userId: payload.userId || createdUser?._id,
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
