FROM node:11.6.0-alpine

# In production postgres is only accessible from the ECS nodes. If for some reason we need to access psql
# manually having the client installed here means we can ssh to the container and from there connect to
# the DB
RUN apk --no-cache add postgresql-client postgresql

COPY --chown=node:node package.json package-lock.json /usr/src/app/

WORKDIR /usr/src/app

RUN npm ci

COPY --chown=node:node . .

USER node

ENV NODE_ENV=production

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]
