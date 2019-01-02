import { makeExecutableSchema } from 'graphql-tools';
import { mapKeys, camelCase, intersection } from 'lodash/fp';

import { requireTypesFile, readTypesFile } from './utils/files';

import scalars from './scalars';

const sentenceKeys = mapKeys((key) => {
  const [firstLetter, ...rest] = camelCase(key);
  return `${firstLetter.toUpperCase()}${rest.join('')}`;
});

const combineModules = (modules) => Object.keys(modules).reduce((acc, key) => {
  const definitions = modules[key];

  const clashes = intersection(Object.keys(acc), Object.keys(definitions));
  if (clashes.length) {
    throw new Error(`Methods ${clashes.join(', ')} declared twice.`);
  }

  return {
    ...acc,
    ...definitions,
  };
}, {});

export default async () => {
  // Scalar declarations
  const scalarDefs = Object.keys(scalars).map((scalar) => `scalar ${scalar}`);

  // Type definitions
  const typeDefs = Object.values(await readTypesFile('schema.gql'));

  // Resolvers
  const resolvers = sentenceKeys(await requireTypesFile('resolver'));

  // Queries from types
  const queries = combineModules(await requireTypesFile('queries'));

  // Mutations from types
  const mutations = combineModules(await requireTypesFile('mutations'));

  // Create our schema
  return makeExecutableSchema({
    resolvers: {
      ...scalars,
      ...resolvers,

      Query: queries,
      Mutation: mutations,
    },
    typeDefs: [...scalarDefs, ...typeDefs],
  });
};
