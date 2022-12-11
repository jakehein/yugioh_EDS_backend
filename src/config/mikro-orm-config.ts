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
    `mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_USER_PASSWORD}@yugioh-eds.yjfb6fm.mongodb.net/?retryWrites=true&w=majority`,
    'mongodb://localhost:27017',
  );
  //console.log(process.env.MONGO_USER_NAME);

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
