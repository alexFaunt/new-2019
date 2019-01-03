export default () => (ctx, next) => {
  const header = ctx.request.get('Authorization');

  if (!header) {
    ctx.response.status = 401;
    ctx.response.set('WWW-Authenticate', 'Basic realm="app"');
  }

  return next();
};
