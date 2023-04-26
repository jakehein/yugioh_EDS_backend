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
exports.FlushInterceptor = void 0;
const mongodb_1 = require("@mikro-orm/mongodb");
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let FlushInterceptor = class FlushInterceptor {
    constructor(em) {
        this.em = em;
    }
    intercept(context, next) {
        const shouldFlush = !context.getHandler().doNotFlush;
        return next.handle().pipe((0, operators_1.mergeMap)(async (x) => {
            if (shouldFlush) {
                await this.em.flush();
            }
            return x;
        }));
    }
};
FlushInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mongodb_1.EntityManager])
], FlushInterceptor);
exports.FlushInterceptor = FlushInterceptor;
//# sourceMappingURL=flush.interceptors.js.map