import { UserFieldResolver } from '../user/resolver';
import { IModelUser } from '../user/model';

// TODO - this is what we look up, should contain user + permissions
export type Auth = any;

interface IRootQuery {
  user: UserFieldResolver<Auth>;
}

const resolver: IRootQuery = {
  user: (auth) => ({
    id: '1',
    email: 'hello',
  }),
};

export default resolver;
