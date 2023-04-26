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
exports.ContentController = void 0;
const common_1 = require("@nestjs/common");
const content_service_1 = require("./content.service");
const bearer_auth_guard_1 = require("../auth/bearer-auth.guard");
const casl_guard_1 = require("../auth/casl.guard");
const content_schema_1 = require("./content.schema");
let ContentController = class ContentController {
    constructor(contentService) {
        this.contentService = contentService;
    }
    get() {
        return this.contentService.get();
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, casl_guard_1.CaslAbilityHandlers)((ability) => ability.can('read', content_schema_1.ContentData)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContentController.prototype, "get", null);
ContentController = __decorate([
    (0, common_1.Controller)('content'),
    (0, common_1.UseGuards)(bearer_auth_guard_1.BearerAuthGuard, casl_guard_1.CaslGuard),
    __metadata("design:paramtypes", [content_service_1.ContentService])
], ContentController);
exports.ContentController = ContentController;
//# sourceMappingURL=content.controller.js.map