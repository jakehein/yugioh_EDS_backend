"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineAbilityFor = void 0;
const ability_1 = require("@casl/ability");
const user_schema_1 = require("../user/user.schema");
const content_schema_1 = require("../content/content.schema");
function defineAbilityFor(user) {
    const { can, build } = new ability_1.AbilityBuilder(ability_1.createMongoAbility);
    can('read', user_schema_1.User, { _id: user._id });
    can('read', content_schema_1.ContentData);
    can('read', user_schema_1.TrunkOfUser);
    can('read', user_schema_1.DeckOfUser);
    can('read', user_schema_1.SideDeckOfUser);
    can('read', user_schema_1.BoosterPackOfUser);
    return build({
        detectSubjectType: (object) => object.constructor,
    });
}
exports.defineAbilityFor = defineAbilityFor;
//# sourceMappingURL=casl-abilities.js.map