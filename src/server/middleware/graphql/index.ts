import { ApolloServer } from 'apollo-server-koa';
import { createSchema, createContext, createLoaders } from '../../graphql';

const devPlaygroundOptions = {
  settings: {
    'request.credentials': 'include',
  },
};

export default async ({ server, pool, playgroundEnabled }) => {
  const schema = await createSchema();

  const loaders = createLoaders({ pool });

  // TODO create models/loaders from pool and add them to context
  const playground = playgroundEnabled ? devPlaygroundOptions : false;

  const apollo = new ApolloServer({
    schema,
    context: ({ ctx }) => createContext({
      loaders,
      auth: ctx.state.auth,
    }),
    playground,
  });

  apollo.applyMiddleware({
    app: server,
  });
};
