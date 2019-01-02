import { GraphQLResolveInfo } from 'graphql';
import { IContext } from './context';
import { IDefaultArgs } from './types';

export interface IDefaultArgs {
  [argName: string]: any;
}

export type FieldResolver<TSource, TResponse, TArgs = IDefaultArgs> = (
  source: TSource,
  args: TArgs,
  context: IContext,
  info: GraphQLResolveInfo,
) => TResponse;

export type QueryFieldResolver<TResponse, TArgs = IDefaultArgs> = FieldResolver<null, TResponse, TArgs>;
