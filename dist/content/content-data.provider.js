"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentDataProvider = exports.CONTENT_DATA = void 0;
const promises_1 = require("fs/promises");
exports.CONTENT_DATA = Symbol('CONTENT_DATA');
exports.contentDataProvider = {
    provide: exports.CONTENT_DATA,
    async useFactory() {
        const contentDataString = await (0, promises_1.readFile)('public/content.json', {
            encoding: 'utf-8',
        });
        const contentData = JSON.parse(contentDataString);
        return contentData;
    },
};
//# sourceMappingURL=content-data.provider.js.map