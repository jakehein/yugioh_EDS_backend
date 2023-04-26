import { User } from '../user/user.schema';
import { AppAbility } from './casl-abilities';
export declare function throwUnlessAuthorized(user: User, pred: (ability: AppAbility) => boolean): void;
