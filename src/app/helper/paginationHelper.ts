const paginationHelper = (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const searchTerm = query.searchTerm || '';

  return {
    page,
    limit,
    skip,
    searchTerm,
  };
};

export default paginationHelper;
