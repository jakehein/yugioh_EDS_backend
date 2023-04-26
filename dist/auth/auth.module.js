"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const app_1 = require("firebase-admin/app");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const user_module_1 = require("../user/user.module");
const auth_service_1 = require("./auth.service");
const bearer_strategy_1 = require("./bearer.strategy");
const auth_controller_1 = require("./auth.controller");
const config_1 = require("@nestjs/config");
const auth_1 = require("firebase-admin/auth");
const user_email_retriever_service_1 = require("./user-email-retriever.service");
const firebase_service_1 = require("../firebase/firebase.service");
const firebaseFactory = {
    provide: 'FIREBASE_ADMIN',
    useFactory: (configService) => {
        const serviceAccountJsonPath = configService.get('FIREBASE_SERVICE_ACCOUNT_JSON_PATH');
        let credential;
        if (serviceAccountJsonPath) {
            credential = (0, app_1.cert)(serviceAccountJsonPath);
        }
        else {
            const serviceAccountJsonString = configService.get('FIREBASE_SERVICE_ACCOUNT_JSON');
            if (!serviceAccountJsonString) {
                throw new Error('Neither FIREBASE_SERVICE_ACCOUNT_JSON_PATH nor FIREBASE_SERVICE_ACCOUNT_JSON config has been specified - at least one must be specified');
            }
            credential = (0, app_1.cert)(JSON.parse(serviceAccountJsonString));
        }
        return (0, app_1.initializeApp)({
            credential,
        });
    },
    inject: [config_1.ConfigService],
};
const firebaseAuthFactory = {
    provide: 'FIREBASE_ADMIN_AUTH',
    useFactory: (firebaseApp) => (0, auth_1.getAuth)(firebaseApp),
    inject: ['FIREBASE_ADMIN'],
};
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, user_module_1.UserModule, passport_1.PassportModule],
        providers: [
            auth_service_1.AuthService,
            bearer_strategy_1.BearerStrategy,
            firebaseFactory,
            firebaseAuthFactory,
            user_email_retriever_service_1.UserEmailRetrieverService,
            firebase_service_1.FirebaseService,
        ],
        exports: [
            auth_service_1.AuthService,
            'FIREBASE_ADMIN_AUTH',
            user_email_retriever_service_1.UserEmailRetrieverService,
            firebase_service_1.FirebaseService,
        ],
        controllers: [auth_controller_1.AuthController],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map