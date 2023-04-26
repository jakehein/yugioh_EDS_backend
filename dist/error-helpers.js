"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const rxjs_1 = require("rxjs");
function handleError(errorClass, cb) {
    return (0, rxjs_1.catchError)((err) => {
        if (err instanceof errorClass) {
            throw cb(err);
        }
        throw err;
    });
}
exports.handleError = handleError;
//# sourceMappingURL=error-helpers.js.map