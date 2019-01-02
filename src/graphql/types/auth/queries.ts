import { QueryFieldResolver } from '../../types';

import { Auth } from './resolver';

interface IRootQuery {
  auth: QueryFieldResolver<Auth>;
}

const queries: IRootQuery = {
  auth: (root, args, context) => ({
    id: context.staticContext,
  }),
};

export default queries;
