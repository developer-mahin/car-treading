/* eslint-disable @typescript-eslint/no-explicit-any */
import { USER_ROLE } from '../../constant';
import { TAuthUser } from '../../interface/authUser';
import AggregationQueryBuilder from '../../QueryBuilder/aggregationBuilder';
import QueryBuilder from '../../QueryBuilder/queryBuilder';
import generateUID from '../../utils/generateUid';
import sendMail from '../../utils/sendMail';
import User from '../user/user.model';
import { TSubmitListing } from './submitListing.interface';
import SubmitListing from './submitListing.model';

const createSubmitListing = async (payload: Partial<TSubmitListing> | any) => {
  let createdUser;

  const defaultPassword = Math.floor(10000000 + Math.random() * 90000000);

  if (!payload.userId || payload.userId === '') {
    createdUser = await User.create({
      email: payload.email,
      password: defaultPassword,
      role: USER_ROLE.private_user,
      first_name: payload.first_name,
      last_name: payload.last_name,
      phoneNumber: payload.phoneNumber,
      needPasswordChange: true,
      uuid: await generateUID(),
    });

    await sendMail({
      email: payload.email,
      subject: 'Welcome to Car Trading',
      html: `
        <h3>Change Your Password Your Default Password is ${defaultPassword}</h3>
        `,
    });
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
        $match: {
          isOffer: false,
        },
      },
    ])
    .filter(['fuel', 'mark'])
    .rangeFilterForModel(['modelsFrom', 'modelsTo'])
    .rangeFilterForDriven(['drivenKmFrom', 'drivenKmTo'])
    .sort()
    .paginate()
    .execute(SubmitListing);

  const pagination = await submitListingQuery.countTotal(SubmitListing);

  return { pagination, result };
};

const getMySubmitListing = async (
  user: TAuthUser,
  query: Record<string, unknown>,
) => {
  const submitListingQuery = new QueryBuilder(
    SubmitListing.find({ userId: user.userId }),
    query,
  );

  const result = await submitListingQuery.sort().paginate().queryModel;

  const pagination = await submitListingQuery.countTotal();
  return { pagination, result };
};

const updateSubmitListing = async (
  id: string,
  payload: Partial<TSubmitListing>,
) => {
  const result = await SubmitListing.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteSubmitListing = async (id: string) => {
  const result = await SubmitListing.findByIdAndDelete(id);
  return result;
};

export const SubmitListingService = {
  createSubmitListing,
  getSubmitListing,
  getMySubmitListing,
  updateSubmitListing,
  deleteSubmitListing,
};
