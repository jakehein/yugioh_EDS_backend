import { ConfigService } from '@nestjs/config';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import {
  User,
  UserBoosterPack,
  UserDeck,
  UserSideDeck,
} from '../user/user.schema';
//import { ContentData } from '../content/content.schema';

export const MIKRO_ORM_CONFIG = Symbol('MIKRO_ORM_CONFIG');

function mikroOrmConfigFactory(
  configService: ConfigService,
): MikroOrmModuleOptions {
  const mongoUrl = configService.get<string>(
    'MONGO_URL',
    'mongodb://root:localdev@localhost:27017/',
    //'mongodb://localhost:27017',
  );
  //console.log(process.env.MONGO_USER_NAME);
  console.log(mongoUrl);
  //console.log(process.env.MONGO_URL);

  return {
    entities: [User, UserBoosterPack, UserDeck, UserSideDeck], //ContentData],
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
