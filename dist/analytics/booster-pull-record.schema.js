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
exports.BoosterPullRecord = void 0;
const core_1 = require("@mikro-orm/core");
const base_record_schema_1 = require("./base-record.schema");
const mongodb_1 = require("@mikro-orm/mongodb");
const card_interface_1 = require("../card/card.interface");
let BoosterPullRecord = class BoosterPullRecord extends base_record_schema_1.BaseRecord {
    constructor(userId, PackPulledFrom, cardIds) {
        super(new mongodb_1.ObjectId());
        this.userId = userId;
        this.pulledOn = new Date();
        this.PackPulledFrom = PackPulledFrom;
        this.cardIds = cardIds;
    }
};
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", mongodb_1.ObjectId)
], BoosterPullRecord.prototype, "userId", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Date)
], BoosterPullRecord.prototype, "pulledOn", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", String)
], BoosterPullRecord.prototype, "PackPulledFrom", void 0);
__decorate([
    (0, core_1.Property)(),
    __metadata("design:type", Array)
], BoosterPullRecord.prototype, "cardIds", void 0);
BoosterPullRecord = __decorate([
    (0, core_1.Entity)({ collection: 'log-booster-pull-record' }),
    __metadata("design:paramtypes", [mongodb_1.ObjectId, String, Array])
], BoosterPullRecord);
exports.BoosterPullRecord = BoosterPullRecord;
//# sourceMappingURL=booster-pull-record.schema.js.map