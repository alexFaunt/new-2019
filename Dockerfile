FROM node:11.6.0-alpine

# In production postgres is only accessible from the ECS nodes. If for some reason we need to access psql
# manually having the client installed here means we can ssh to the container and from there connect to
# the DB
RUN apk --no-cache add postgresql-client postgresql

COPY --chown=node:node package.json package-lock.json /usr/src/app/

WORKDIR /usr/src/app

# Packages with pre-built native modules that are ABI incompatible (like bcrypt)
# need to perform a source build to target the right libc. This is done through
# node-pre-gyp, which relies on having python and the GCC toolchain available.
# More info at:
# - https://github.com/kelektiv/node.bcrypt.js/commit/9a9ab453ed5cd9699e4371eba88f7d9f99e01a2a
# - https://github.com/kelektiv/node.bcrypt.js/issues/528
# - https://github.com/nodejs/docker-node/issues/384
RUN apk --no-cache add --virtual native-deps make python gcc g++ && \
  npm ci  && \
  apk del native-deps

COPY --chown=node:node . .

USER node

ENV NODE_ENV=production

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]
