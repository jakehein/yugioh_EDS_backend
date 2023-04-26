"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwUnlessAuthorized = void 0;
const common_1 = require("@nestjs/common");
const casl_abilities_1 = require("./casl-abilities");
function throwUnlessAuthorized(user, pred) {
    const ability = (0, casl_abilities_1.defineAbilityFor)(user);
    if (!pred(ability)) {
        throw new common_1.ForbiddenException();
    }
}
exports.throwUnlessAuthorized = throwUnlessAuthorized;
//# sourceMappingURL=casl-helper.js.map