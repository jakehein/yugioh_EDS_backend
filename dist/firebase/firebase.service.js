"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
let FirebaseService = class FirebaseService {
    constructor(configService) {
        this.configService = configService;
        this.app = (0, app_1.initializeApp)({
            apiKey: configService.get('FIREBASE_WEB_API_KEY'),
            authDomain: configService.get('FIREBASE_AUTH_DOMAIN'),
            projectId: configService.get('FIREBASE_PROJECT_ID'),
            storageBucket: configService.get('FIREBASE_STORAGE_BUCKET'),
            messagingSenderId: configService.get('FIREBASE_MESSAGING_SENDER_ID'),
            appId: configService.get('FIREBASE_APP_ID'),
            measurementId: configService.get('FIREBASE_MEASUREMENT_ID'),
        });
        this.auth = (0, auth_1.getAuth)(this.app);
    }
};
FirebaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FirebaseService);
exports.FirebaseService = FirebaseService;
//# sourceMappingURL=firebase.service.js.map