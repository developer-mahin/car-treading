// /* eslint-disable no-console */
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
  filter(filterableFields: string[]) {
    const queryObj = { ...this.query };

    const excludesField = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludesField.forEach((field) => delete queryObj[field]);

    const filters = this.query.filter;

    if (filters) {
      // Normalize to array whether single or multiple
      const filterValues = Array.isArray(filters) ? filters : [filters];

      const orConditions: any = [];

      filterValues.forEach((filterVal) => {
        filterableFields.forEach((field) => {
          orConditions.push({
            [field]: { $regex: filterVal, $options: 'i' },
          });
        });
      });

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

  rangeFilterForModel(fieldPair: [string, string]) {
    const queryObj = { ...this.query };
    const excludesField = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludesField.forEach((field) => delete queryObj[field]);

    const fromField = fieldPair[0]; // e.g. "modelsFrom"
    const toField = fieldPair[1]; // e.g. "modelsTo"

    const fromVal = queryObj[fromField];
    const toVal = queryObj[toField];

    if (fromVal !== undefined || toVal !== undefined) {
      const condition: Record<string, any> = {};

      if (fromVal !== undefined)
        condition[fromField] = { $gte: Number(fromVal) };
      if (toVal !== undefined) condition[toField] = { $lte: Number(toVal) };

      this.aggregationPipeline.push({
        $match: condition,
      });
    }

    return this;
  }

  rangeFilterForDriven(fieldPair: [string, string]) {
    const queryObj = { ...this.query };
    const excludesField = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludesField.forEach((field) => delete queryObj[field]);

    const fromField = fieldPair[0]; // e.g. "modelsFrom"
    const toField = fieldPair[1]; // e.g. "modelsTo"

    const fromVal = queryObj[fromField];
    const toVal = queryObj[toField];

    if (fromVal !== undefined || toVal !== undefined) {
      const condition: Record<string, any> = {};

      if (fromVal !== undefined)
        condition[fromField] = { $gte: Number(fromVal) };
      if (toVal !== undefined) condition[toField] = { $lte: Number(toVal) };

      this.aggregationPipeline.push({
        $match: condition,
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
    // const sort = this.query.sort || '-updatedAt';
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
      throw new Error('Error in aggregation query');
    }
  }

  // Adds a count query to get total documents for pagination
  async countTotal(model: any) {
    // Create a new pipeline without $skip and $limit
    const countPipeline = this.aggregationPipeline.filter(
      (stage) => !stage.$skip && !stage.$limit,
    );

    // Add the $count stage
    countPipeline.push({ $count: 'totalCount' });

    try {
      const totalCountResult = await model.aggregate(countPipeline);

      const total = totalCountResult[0]?.totalCount || 0;
      const page = Number(this.query.page) || 1;
      const limit = Number(this.query.limit) || 10;
      const totalPage = Math.ceil(total / limit);

      return {
        total,
        totalPage,
        page,
        limit,
      };
    } catch (error) {
      console.error('Error in total count aggregation:', error);
      throw new Error('Failed to get total count');
    }
  }
}

export default AggregationQueryBuilder;
