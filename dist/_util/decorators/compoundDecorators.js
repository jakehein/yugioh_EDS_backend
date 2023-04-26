"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonGuardedControllerDecorator = exports.ApiControllerHeader = exports.IntApiDecorator = exports.EnumApiDecorator = exports.NumberApiDecorator = exports.StringArrayApiDecorator = exports.BoosterPackStringArrayApiDecorator = exports.StringApiDecorator = exports.ObjectArrayOfTypeDecorator = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const common_2 = require("@nestjs/common");
const common_3 = require("@nestjs/common");
const bearer_auth_guard_1 = require("../../auth/bearer-auth.guard");
const common_4 = require("@nestjs/common");
const content_errors_1 = require("../../content-errors");
function ObjectArrayOfTypeDecorator(type, isOptional = false) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiProperty)({ type: type, required: !isOptional }), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(() => type), ...(isOptional ? [(0, class_validator_1.IsOptional)()] : []));
}
exports.ObjectArrayOfTypeDecorator = ObjectArrayOfTypeDecorator;
function StringApiDecorator(isOptional = false) {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsString)(), (0, swagger_1.ApiProperty)({ required: !isOptional }), ...(isOptional ? [(0, class_validator_1.IsOptional)()] : []));
}
exports.StringApiDecorator = StringApiDecorator;
function BoosterPackStringArrayApiDecorator(isOptional = false) {
    return (0, common_1.applyDecorators)(StringArrayApiDecorator(isOptional), (0, class_validator_1.ArrayMaxSize)(5), (0, class_validator_1.ArrayMinSize)(5));
}
exports.BoosterPackStringArrayApiDecorator = BoosterPackStringArrayApiDecorator;
function StringArrayApiDecorator(isOptional = false) {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsNotEmpty)({ each: true }), (0, swagger_1.ApiProperty)({ required: !isOptional }), ...(isOptional ? [(0, class_validator_1.IsOptional)()] : []));
}
exports.StringArrayApiDecorator = StringArrayApiDecorator;
function NumberApiDecorator(isOptional = false) {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsNumber)(), (0, swagger_1.ApiProperty)({ required: !isOptional }), ...(isOptional ? [(0, class_validator_1.IsOptional)()] : []));
}
exports.NumberApiDecorator = NumberApiDecorator;
function EnumApiDecorator(enumtype, isOptional = false) {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsEnum)(enumtype), (0, swagger_1.ApiProperty)({ required: !isOptional }), ...(isOptional ? [(0, class_validator_1.IsOptional)()] : []));
}
exports.EnumApiDecorator = EnumApiDecorator;
function IntApiDecorator(isOptional = false) {
    return (0, common_1.applyDecorators)((0, class_validator_1.IsInt)(), (0, swagger_1.ApiProperty)({ required: !isOptional }), ...(isOptional ? [(0, class_validator_1.IsOptional)()] : []));
}
exports.IntApiDecorator = IntApiDecorator;
function ApiControllerHeader(swaggerTag, controllerPath = '') {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(swaggerTag), (0, common_2.Controller)(controllerPath));
}
exports.ApiControllerHeader = ApiControllerHeader;
function CommonGuardedControllerDecorator(swaggerTag, controllerPath = '') {
    return (0, common_1.applyDecorators)(ApiControllerHeader(swaggerTag, controllerPath), (0, swagger_1.ApiBearerAuth)(), (0, common_3.UseGuards)(bearer_auth_guard_1.BearerAuthGuard), (0, common_4.UseInterceptors)(content_errors_1.ContentInterceptor));
}
exports.CommonGuardedControllerDecorator = CommonGuardedControllerDecorator;
//# sourceMappingURL=compoundDecorators.js.map