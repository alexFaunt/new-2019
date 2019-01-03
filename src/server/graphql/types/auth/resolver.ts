import { UserFieldResolver } from '../user/resolver';
import { IContextAuth } from '../../context';

interface IRootQuery {
  user: UserFieldResolver<IContextAuth>;
}

const resolver: IRootQuery = {
  user: (auth) => auth.user,
};

export default resolver;
