import { ApolloServer } from 'apollo-server-koa';
import { createSchema, createContext } from '../../graphql';

const devPlaygroundOptions = {
  settings: {
    'request.credentials': 'include',
  },
};

export default async ({ server, playgroundEnabled }) => {
  const schema = await createSchema();

  // TODO create models/loaders from pool and add them to context
  const playground = playgroundEnabled ? devPlaygroundOptions : false;

  const apollo = new ApolloServer({
    schema,
    context: ({ ctx }) => createContext({ auth: ctx.state.auth }),
    playground,
  });

  apollo.applyMiddleware({
    app: server,
  });
};
