/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public queryModel: Query<T[], T> | any;
  public query: Record<string, unknown>;

  constructor(queryModel: Query<T[], T>, query: Record<string, unknown>) {
    this.queryModel = queryModel;
    this.query = query;
  }

  search(searchableField: string[]) {
    if (this?.query?.searchTerm) {
      this.queryModel = this.queryModel.find({
        $or: searchableField.map(
          (field) =>
            ({
              [field]: { $regex: this?.query?.searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  filter(filterableQuery: string[]) {
    const queryObj = { ...this.query };

    const filteredQuery = Object.keys(queryObj)
      .filter((key) => filterableQuery.includes(key))
      .reduce(
        (obj, key) => {
          obj[key] = { $regex: queryObj[key], $options: 'i' };
          return obj;
        },
        {} as Record<string, any>,
      );

    // filtering
    const excludesField = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludesField.forEach((ele) => delete queryObj[ele]);

    this.queryModel = this.queryModel.find(filteredQuery as FilterQuery<T>);
    return this;
  }

  sort() {
    const sort = this?.query?.sort || '-createdAt';
    this.queryModel = this?.queryModel.sort(sort as string);
    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;
    this.queryModel = this?.queryModel?.skip(skip).limit(limit);
    return this;
  }

  async countTotal() {
    const totalQueries = this?.queryModel?.getFilter();
    const total = await this?.queryModel.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
