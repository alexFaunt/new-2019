import { IModelUser } from './types/user/model';

interface IPermissions {
  todo: string;
}

export interface IContextAuth {
  user: IModelUser | null;
  permissions: IPermissions;
}

export interface IContextArgs {
  auth: IContextAuth;
  loaders: any; // TODO
}

export interface IContext {
  auth: IContextAuth;
  loaders: any; // TODO
}

export default ({ auth, loaders }: IContextArgs): IContext => ({ auth, loaders });
