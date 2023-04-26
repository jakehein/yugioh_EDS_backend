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
exports.CaslGuard = exports.CaslAbilityHandlers = exports.CASL_ABILITY_HANDLERS = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const casl_abilities_1 = require("./casl-abilities");
exports.CASL_ABILITY_HANDLERS = Symbol('CASL_ABILITY_HANDLERS');
const CaslAbilityHandlers = (...handlers) => (0, common_1.SetMetadata)(exports.CASL_ABILITY_HANDLERS, handlers);
exports.CaslAbilityHandlers = CaslAbilityHandlers;
let CaslGuard = class CaslGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const { user } = context.switchToHttp().getRequest();
        const ability = (0, casl_abilities_1.defineAbilityFor)(user.user);
        const caslAbilityHandlers = this.reflector.getAllAndMerge(exports.CASL_ABILITY_HANDLERS, [context.getHandler(), context.getClass()]);
        return caslAbilityHandlers.every((handler) => handler(ability));
    }
};
CaslGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], CaslGuard);
exports.CaslGuard = CaslGuard;
//# sourceMappingURL=casl.guard.js.map