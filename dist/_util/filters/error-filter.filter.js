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
exports.ExceptionCatchFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
let ExceptionCatchFilter = class ExceptionCatchFilter extends core_1.BaseExceptionFilter {
    constructor(httpAdapterHost) {
        super(httpAdapterHost.httpAdapter);
    }
    catch(exception, host) {
        super.catch(exception, host);
    }
};
ExceptionCatchFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [core_1.HttpAdapterHost])
], ExceptionCatchFilter);
exports.ExceptionCatchFilter = ExceptionCatchFilter;
//# sourceMappingURL=error-filter.filter.js.map