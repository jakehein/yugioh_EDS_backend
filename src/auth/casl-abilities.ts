import {
  AbilityBuilder,
  createMongoAbility,
  InferSubjects,
  ExtractSubjectType,
  MongoAbility,
} from '@casl/ability';
import {
  BoosterPackOfUser,
  DeckOfUser,
  SideDeckOfUser,
  TrunkOfUser,
  User,
} from '../user/user.schema';
import { ContentData } from '../content/content.schema';

export type Actions =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'start'
  | 'start-debug'
  | 'queue-actions'
  | 'perform-actions';
export type Subjects = InferSubjects<
  | typeof ContentData
  | typeof User
  | typeof TrunkOfUser
  | typeof DeckOfUser
  | typeof SideDeckOfUser
  | typeof BoosterPackOfUser
>;
export type AppAbility = MongoAbility<[Actions, Subjects]>;

export function defineAbilityFor(user: User) {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  can('read', User, { _id: user._id });
  can('read', ContentData);
  can('read', TrunkOfUser);
  can('read', DeckOfUser);
  can('read', SideDeckOfUser);
  can('read', BoosterPackOfUser);

  return build({
    detectSubjectType: (object) =>
      object.constructor as ExtractSubjectType<Subjects>,
  });
}
