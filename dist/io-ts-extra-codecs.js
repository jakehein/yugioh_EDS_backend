"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.email = void 0;
const t = require("io-ts");
const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
exports.email = t.brand(t.string, (s) => emailRegex.test(s), 'Email');
//# sourceMappingURL=io-ts-extra-codecs.js.map