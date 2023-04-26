import { ConfigService } from '@nestjs/config';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
export declare const MIKRO_ORM_CONFIG: unique symbol;
declare function mikroOrmConfigFactory(configService: ConfigService): MikroOrmModuleOptions;
export declare const mikroOrmConfigProvider: {
    provide: symbol;
    inject: (typeof ConfigService)[];
    useFactory: typeof mikroOrmConfigFactory;
};
export {};
