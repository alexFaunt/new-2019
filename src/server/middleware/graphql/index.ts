import { ApolloServer } from 'apollo-server-koa';
import { createSchema, createContext } from '../../../graphql';

export default async (server) => {
  const schema = await createSchema();

  const apollo = new ApolloServer({
    schema,
    context: () => createContext(),
  });

  apollo.applyMiddleware({
    app: server,
  });
};
