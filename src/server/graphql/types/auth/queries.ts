import { QueryFieldResolver } from '../../types';

import { IContextAuth } from '../../context';

interface IRootQuery {
  auth: QueryFieldResolver<IContextAuth>;
}

const queries: IRootQuery = {
  auth: (root, args, context) => context.auth,
};

export default queries;
