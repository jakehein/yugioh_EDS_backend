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
exports.ContentAccessorService = void 0;
const common_1 = require("@nestjs/common");
const content_service_1 = require("./content.service");
let ContentAccessorService = class ContentAccessorService {
    constructor(contentService) {
        this.contentService = contentService;
        this.unpackContent(contentService.get());
    }
    unpackContent(content) {
        this.contentByTypeAndId = {
            boosterPacks: {},
            cards: {},
        };
        const contentTypes = Object.keys(content);
        contentTypes.forEach((type) => {
            content[type].forEach((item) => {
                this.contentByTypeAndId[type][item.id] = item;
            });
        });
    }
    getContentData() {
        return this.contentService.get();
    }
    getContentEntryByIdAndContentTypeOptional(type, id) {
        if (!(id in this.contentByTypeAndId[type])) {
            return undefined;
        }
        return this.contentByTypeAndId[type][id];
    }
    getAllContentEntriesByContentType(type) {
        return Object.values(this.contentByTypeAndId[type]);
    }
    getContentEntryByName(type, name) {
        return this.getAllContentEntriesByContentType(type).find((item) => item.name === name);
    }
    getAllContentCardsByPasscode(passcode) {
        return this.getAllContentEntriesByContentType('cards').filter((card) => card.passcode === passcode);
    }
};
ContentAccessorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [content_service_1.ContentService])
], ContentAccessorService);
exports.ContentAccessorService = ContentAccessorService;
//# sourceMappingURL=content-accessor.service.js.map