import { FieldResolver, IDefaultArgs } from '../../types';
import { IModelUser } from './model';

export interface IUserType {
  email: IModelUser['email'];
}

export type UserFieldResolver<TSource, TArgs = IDefaultArgs> = FieldResolver<TSource, IModelUser, TArgs>;

interface IResolver {
  email: FieldResolver<IModelUser, IUserType['email']>;
}

const resolver: IResolver  = {
  email: () => 'alex@email.com',
};

export default resolver;
