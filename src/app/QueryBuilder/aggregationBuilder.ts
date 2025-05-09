import paginationHelper from '../helper/paginationHelper';

/* eslint-disable @typescript-eslint/no-explicit-any */
class AggregationQueryBuilder {
  private aggregationPipeline: any[];
  private query: Record<string, unknown>;

  constructor(query: Record<string, unknown>) {
    this.aggregationPipeline = [];
    this.query = query;
  }

  // Adds search functionality using regex for partial matching
  search(searchableFields: string[]) {
    console.log(searchableFields, 'searchableFields');
    console.log(this.query.searchTerm, 'this.query.searchTerm');
    if (this.query.searchTerm) {
      const searchCondition = {
        $match: {
          $or: searchableFields.map((field) => ({
            [field]: { $regex: this.query.searchTerm, $options: 'i' },
          })),
        },
      };
      this.aggregationPipeline.push(searchCondition);
    }
    return this;
  }

  // Filters the query based on specific filterable fields
  // filter(filterableFields: string[]) {
  //   const queryObj = { ...this.query };

  //   const excludesField = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  //   excludesField.forEach((field) => delete queryObj[field]);

  //   if (this.query.filter) {
  //     filterableFields.forEach((field) => {
  //       if (field) {
  //         this.aggregationPipeline.push({
  //           $match: {
  //             [field]: { $regex: queryObj.filter, $options: 'i' },
  //           },
  //         });
  //       }
  //     });
  //   }

  //   return this;
  // }

  filter(filterableFields: string[]) {
    const queryObj = { ...this.query };

    const excludesField = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludesField.forEach((field) => delete queryObj[field]);

    if (this.query.filter) {
      const orConditions = filterableFields.map((field) => ({
        [field]: { $regex: queryObj.filter, $options: 'i' },
      }));

      this.aggregationPipeline.push({
        $match: {
          $or: orConditions,
        },
      });
    }

    return this;
  }

  rangeFilter(filterableFields: string[]) {
    const queryObj = { ...this.query };

    console.log(queryObj, 'queryObj');

    const excludesField = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludesField.forEach((field) => delete queryObj[field]);

    const matchConditions: any = {};

    filterableFields.forEach((field) => {
      const fromKey = `${field}From`;
      const toKey = `${field}To`;

      // console.log(fromKey, "fromKey");
      // console.log(toKey, "toKey");

      if (queryObj[fromKey] || queryObj[toKey]) {
        matchConditions[field] = {};

        if (queryObj[fromKey]) {
          matchConditions[field]['$gte'] = Number(queryObj[fromKey]);

          console.log(matchConditions[field], 'matchConditions[field]');
          console.log(Number(queryObj[fromKey]), 'Number(queryObj[fromKey])');
        }
        if (queryObj[toKey]) {
          matchConditions[field]['$lte'] = Number(queryObj[toKey]);
        }
      }
    });

    if (Object.keys(matchConditions).length > 0) {
      this.aggregationPipeline.push({
        $match: matchConditions,
      });
    }

    return this;
  }

  customPipeline(pipeline: any) {
    this.aggregationPipeline.push(...pipeline);
    return this;
  }

  // Adds sorting to the aggregation pipeline
  sort() {
    const sort = this.query.sort || '-createdAt';
    this.aggregationPipeline.push({ $sort: this.parseSort(sort as string) });
    return this;
  }

  // Parses the sort query into MongoDB-friendly format
  parseSort(sort: string) {
    const parsedSort: Record<string, number> = {};
    const sortFields = sort.split(',');

    sortFields.forEach((field) => {
      const direction = field.startsWith('-') ? -1 : 1;
      const key = field.replace(/^[-+]/, ''); // Remove leading '-' or '+' from the field
      parsedSort[key] = direction;
    });

    return parsedSort;
  }

  // Adds pagination to the aggregation pipeline
  paginate() {
    const { limit, skip } = paginationHelper(this.query);

    this.aggregationPipeline.push({ $skip: skip });
    this.aggregationPipeline.push({ $limit: limit });

    return this;
  }

  // Adds projection to return only the necessary fields
  project(fields: any) {
    const projectObj: Record<string, number> = {};

    fields.forEach((field: any) => {
      projectObj[field] = 1;
    });

    this.aggregationPipeline.push({ $project: projectObj });
    return this;
  }

  customProjection(field: any) {
    this.aggregationPipeline.push({ $project: field });
    return this;
  }

  // Executes the aggregation query and returns the result
  async execute(model: any) {
    try {
      const result = await model.aggregate(this.aggregationPipeline);
      return result;
    } catch (error) {
      console.error('Aggregation error:', error);
      throw new Error('Error in aggregation query');
    }
  }

  // Adds a count query to get total documents for pagination
  async countTotal(model: any) {
    const totalCountPipeline = [
      ...this.aggregationPipeline,
      {
        $count: 'totalCount',
      },
    ];

    try {
      const totalCountResult = await model.aggregate(totalCountPipeline);
      const total = totalCountResult[0]?.totalCount || 0;
      const page = Number(this.query.page) || 1;
      const limit = Number(this.query.limit) || 10;
      const totalPage = Math.ceil(total / limit);

      return {
        total: total,
        totalPage: totalPage,
        page: page,
        limit,
      };
    } catch (error) {
      console.error('Error in total count aggregation:', error);
      throw new Error('Failed to get total count');
    }
  }
}

export default AggregationQueryBuilder;
