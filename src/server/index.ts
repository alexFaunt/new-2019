import * as Koa from 'koa';
import * as koaBody from 'koa-bodyparser';
import * as Router from 'koa-router';
import * as serve from 'koa-static';

import app from './middleware/app';
import graphql from './middleware/graphql';
import auth from './middleware/auth';
import basic from './middleware/auth/basic';
import createPool from './store/pool';
import createLogger from './common/logger';

const logger = createLogger('server');

export default async (config) => {
  const server = new Koa();
  const router = new Router();

  const poolOptions = {
    connection: {
      host: config.POSTGRES_HOST,
      port: config.POSTGRES_PORT,
      database: config.POSTGRES_DB,
      user: config.POSTGRES_APP_USER,
      password: config.POSTGRES_APP_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    acquireConnectionTimeout: config.POSTGRES_CONNECTION_TIMEOUT,
    debug: true,
  };

  const authPool = createPool(poolOptions);
  const graphqlPool = createPool(poolOptions);

  const { login, authorization, register } = auth(authPool);

  // Global middleware

  // Server dist files
  server.use(serve('dist/static'));

  // Healthcheck
  router.get('/health', (ctx) => { ctx.body = 'OK'; });

  server.use(koaBody());

  // Auth routes
  router.post('/auth/login', login());
  router.post('/auth/register', register());

  // Authenticate calls to graphql playground
  router.get('/graphql', basic());

  // App renders response to everything else
  router.get('*', app());

  server.use(router.routes());
  server.use(router.allowedMethods());

  const allowedMethods = config.ALLOW_BASIC_AUTH ? ['basic', 'bearer'] : ['bearer'];
  // Extract auth from headers going to graphql
  server.use(authorization({ allowedMethods }));

  // Graphql APIs awful pattern
  await graphql(server);

  server.listen(config.PORT, () => {
    logger.info(`Koa server running on ${config.PORT}`);
  });
};
