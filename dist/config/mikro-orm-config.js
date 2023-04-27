"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mikroOrmConfigProvider = exports.MIKRO_ORM_CONFIG = void 0;
const config_1 = require("@nestjs/config");
const user_schema_1 = require("../user/user.schema");
const booster_pull_record_schema_1 = require("../analytics/booster-pull-record.schema");
exports.MIKRO_ORM_CONFIG = Symbol('MIKRO_ORM_CONFIG');
function mikroOrmConfigFactory(configService) {
    const mongoUrl = configService.get('MONGO_URL', 'mongodb://mongo:27017/');
    console.log(mongoUrl);
    return {
        entities: [
            user_schema_1.User,
            user_schema_1.UserCard,
            user_schema_1.UserBoosterPack,
            user_schema_1.UserDeck,
            user_schema_1.UserSideDeck,
            booster_pull_record_schema_1.BoosterPullRecord,
        ],
        dbName: process.env.NODE_ENV === 'production' ? 'yugioh' : 'yugiohtest',
        type: 'mongo',
        ensureIndexes: true,
        clientUrl: mongoUrl,
    };
}
exports.mikroOrmConfigProvider = {
    provide: exports.MIKRO_ORM_CONFIG,
    inject: [config_1.ConfigService],
    useFactory: mikroOrmConfigFactory,
};
//# sourceMappingURL=mikro-orm-config.js.map