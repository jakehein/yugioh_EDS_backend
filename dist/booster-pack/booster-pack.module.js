"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoosterPackModule = void 0;
const common_1 = require("@nestjs/common");
const booster_pack_controller_1 = require("./booster-pack.controller");
const booster_pack_service_1 = require("./booster-pack.service");
const user_module_1 = require("../user/user.module");
const content_module_1 = require("../content/content.module");
const card_module_1 = require("../card/card.module");
let BoosterPackModule = class BoosterPackModule {
};
BoosterPackModule = __decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule, content_module_1.ContentModule, card_module_1.CardModule],
        controllers: [booster_pack_controller_1.BoosterPackController],
        providers: [booster_pack_service_1.BoosterPackService],
        exports: [booster_pack_service_1.BoosterPackService],
    })
], BoosterPackModule);
exports.BoosterPackModule = BoosterPackModule;
//# sourceMappingURL=booster-pack.module.js.map