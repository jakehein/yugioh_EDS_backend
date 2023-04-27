import { ConfigService } from '@nestjs/config';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import {
  User,
  UserCard,
  UserBoosterPack,
  UserDeck,
  UserSideDeck,
} from '../user/user.schema';
import { BoosterPullRecord } from '../analytics/booster-pull-record.schema';

export const MIKRO_ORM_CONFIG = Symbol('MIKRO_ORM_CONFIG');

function mikroOrmConfigFactory(
  configService: ConfigService,
): MikroOrmModuleOptions {
  const mongoUrl = configService.get<string>(
    'MONGO_URL',
    'mongodb://mongo:27017/',
  );

  console.log(mongoUrl);

  return {
    entities: [
      User,
      UserCard,
      UserBoosterPack,
      UserDeck,
      UserSideDeck,
      BoosterPullRecord,
    ],
    dbName: process.env.NODE_ENV === 'production' ? 'yugioh' : 'yugiohtest',
    type: 'mongo',
    ensureIndexes: true,
    clientUrl: mongoUrl,
  };
}

export const mikroOrmConfigProvider = {
  provide: MIKRO_ORM_CONFIG,
  inject: [ConfigService],
  useFactory: mikroOrmConfigFactory,
};
