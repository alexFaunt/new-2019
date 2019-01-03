import { ApolloServer } from 'apollo-server-koa';
import { createSchema, createContext } from '../../graphql';

export default async (server) => {
  const schema = await createSchema();

  // TODO create models/loaders from pool and add them to context

  const apollo = new ApolloServer({
    schema,
    context: ({ ctx }) => createContext({ auth: ctx.state.auth }),
    playground: {
      settings: {
        'request.credentials': 'include',
      },
    },
  });

  apollo.applyMiddleware({
    app: server,
  });
};
