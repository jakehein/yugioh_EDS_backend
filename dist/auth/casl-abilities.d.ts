import { InferSubjects, MongoAbility } from '@casl/ability';
import { BoosterPackOfUser, DeckOfUser, SideDeckOfUser, TrunkOfUser, User } from '../user/user.schema';
import { ContentData } from '../content/content.schema';
export declare type Actions = 'create' | 'read' | 'update' | 'delete' | 'start' | 'start-debug' | 'queue-actions' | 'perform-actions';
export declare type Subjects = InferSubjects<typeof ContentData | typeof User | typeof TrunkOfUser | typeof DeckOfUser | typeof SideDeckOfUser | typeof BoosterPackOfUser>;
export declare type AppAbility = MongoAbility<[Actions, Subjects]>;
export declare function defineAbilityFor(user: User): AppAbility;
