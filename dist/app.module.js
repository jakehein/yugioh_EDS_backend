"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const user_module_1 = require("./user/user.module");
const deck_module_1 = require("./deck/deck.module");
const card_module_1 = require("./card/card.module");
const booster_pack_module_1 = require("./booster-pack/booster-pack.module");
const auth_module_1 = require("./auth/auth.module");
const side_deck_module_1 = require("./side-deck/side-deck.module");
const config_module_1 = require("./config/config.module");
const error_filter_filter_1 = require("./_util/filters/error-filter.filter");
const maintenance_guard_1 = require("./maintenance/maintenance.guard");
const flush_interceptors_1 = require("./_util/interceptors/flush.interceptors");
const app_service_1 = require("./app.service");
const database_module_1 = require("./database/database.module");
const content_module_1 = require("./content/content.module");
const analytics_module_1 = require("./analytics/analytics.module");
const account_module_1 = require("./account/account.module");
const app_controller_1 = require("./app.controller");
const uuid_module_1 = require("./uuid/uuid.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_module_1.ConfigModule,
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            booster_pack_module_1.BoosterPackModule,
            card_module_1.CardModule,
            deck_module_1.DeckModule,
            side_deck_module_1.SideDeckModule,
            user_module_1.UserModule,
            content_module_1.ContentModule,
            analytics_module_1.AnalyticsModule,
            account_module_1.AccountModule,
            uuid_module_1.UuidModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: 'APP_FILTER',
                useClass: error_filter_filter_1.ExceptionCatchFilter,
            },
            {
                provide: 'APP_GUARD',
                useClass: maintenance_guard_1.MaintenanceGuard,
            },
            {
                provide: 'APP_INTERCEPTOR',
                useClass: flush_interceptors_1.FlushInterceptor,
            },
            {
                provide: 'APP_PIPE',
                useClass: common_1.ValidationPipe,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map