import { ApolloServer } from 'apollo-server-koa';
import createSchema from '../../graphql';

export default async (server) => {
  const schema = await createSchema();

  const apollo = new ApolloServer({
    schema,
  });

  apollo.applyMiddleware({
    app: server,
  });
};
