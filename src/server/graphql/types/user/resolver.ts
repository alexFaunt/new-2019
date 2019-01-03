import { FieldResolver, IDefaultArgs } from '../../types';
import { IModelUser } from './model';

export interface IUserType {
  email: string;
  displayName: string;
}

export type UserFieldResolver<TSource, TArgs = IDefaultArgs> = FieldResolver<TSource, IModelUser, TArgs>;

interface IResolver {
  displayName: FieldResolver<IModelUser, IUserType['displayName']>;
}

const resolver: IResolver  = {
  displayName: ({ displayName }) => displayName || 'Mysterious Moose',
};

export default resolver;
