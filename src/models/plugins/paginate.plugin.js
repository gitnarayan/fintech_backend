/* eslint-disable no-param-reassign */

const paginate = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Object[]} results - Results found
   * @property {number} page - Current page
   * @property {number} limit - Maximum number of results per page
   * @property {number} totalPages - Total number of pages
   * @property {number} totalResults - Total number of documents
   */

  schema.statics.paginate = async function (filter = {}, options = {}) {
    try {
      const limit = Math.max(parseInt(options.limit, 10) || 10, 1);
      const page = Math.max(parseInt(options.page, 10) || 1, 1);
      const skip = (page - 1) * limit;

      // Sorting
      const sort = options.sortBy
        ? options.sortBy
          .split(',')
          .map((s) =>
            s.includes(':desc')
              ? `-${s.replace(':desc', '')}`
              : s.replace(':asc', '')
          )
          .join(' ')
        : '-createdAt'; // Default to descending order of createdAt

      // Count total documents
      const totalResults = await this.countDocuments(filter);

      // Fetch paginated results
      let query = this.find(filter).sort(sort).skip(skip).limit(limit);

      // Handle population
      if (options.populate) {
        // const [path, selectFields] = options.populate.split(':');
        // query = query.populate({
        //   path: path.trim(),
        //   select: selectFields.split(',').map(f => f.trim()).join(' ')
        // });
        options.populate.split(',').forEach((populateOption) => {
          query = query.populate(
            populateOption
              .split('.')
              .reverse()
              .reduce((a, b) => ({ path: b, populate: a }))
          );
        });
      }

      query = query.lean(); // Move lean() here after populate()

      const results = await query.exec();
      const totalPages = Math.ceil(totalResults / limit);

      return {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
    } catch (error) {
      throw new Error(`Pagination Error: ${error.message}`);
    }
  };
};

export { paginate };
