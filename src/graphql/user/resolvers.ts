const queries = {};

const mutations = {
  createUser: async (_: any, {}: {}) => {
    return "randomuser";
  },
};

export const resolvers = { queries, mutations };
