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

    if (this.query.filter) {
      filterableFields.forEach((field) => {
        if (field) {
          this.aggregationPipeline.push({
            $match: {
              [field]: { $regex: queryObj.filter, $options: 'i' },
            },
          });
        }
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
      throw new Error('Error in aggregation query');
    }
  }

  // Adds a count query to get total documents for pagination
  async countTotal(model: any) {
    // Clone the pipeline to avoid mutating the original one
    const countPipeline = [...this.aggregationPipeline];

    // Remove the pagination stages ($skip, $limit) from the pipeline for counting total records
    countPipeline.forEach((stage, index) => {
      if (stage.$skip || stage.$limit) {
        countPipeline.splice(index, 1);
      }
    });

    // Add the $count stage to get the total count of documents
    countPipeline.push({
      $count: 'totalCount',
    });

    try {
      // Execute the aggregation to get the total count
      const totalCountResult = await model.aggregate(countPipeline);

      // Calculate total count and total pages
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
      throw new Error('Failed to get total count');
    }
  }
}

export default AggregationQueryBuilder;
