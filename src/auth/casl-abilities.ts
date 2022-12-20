import {
  AbilityBuilder,
  createMongoAbility,
  InferSubjects,
  ExtractSubjectType,
  MongoAbility,
} from '@casl/ability';
import { User } from 'src/user/user.schema';
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
export type Subjects = InferSubjects<typeof ContentData | typeof User>;
export type AppAbility = MongoAbility<[Actions, Subjects]>;

export function defineAbilityFor(user: User) {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  can('read', User, { _id: user._id });
  can('read', ContentData);

  return build({
    detectSubjectType: (object) =>
      object.constructor as ExtractSubjectType<Subjects>,
  });
}
