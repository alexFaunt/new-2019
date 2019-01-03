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
}

export interface IContext {
  auth: IContextAuth;
}

export default ({ auth }: IContextArgs): IContext => ({ auth });
