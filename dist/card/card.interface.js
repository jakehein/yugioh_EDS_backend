"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowedByStatus = exports.Status = exports.Attribute = exports.MonsterType = exports.Property = exports.CardType = exports.Rarity = exports.BoosterPack = void 0;
var BoosterPack;
(function (BoosterPack) {
    BoosterPack["DarkMagician"] = "Dark Magician";
    BoosterPack["MysticalElf"] = "Mystical Elf";
    BoosterPack["RedEyesBDragon"] = "Red-Eyes B. Dragon";
    BoosterPack["JudgeMan"] = "Judge Man";
    BoosterPack["BlueEyesWhiteDragon"] = "Blue-Eyes White Dragon";
    BoosterPack["Exodia"] = "Exodia";
    BoosterPack["CyberHarpie"] = "Cyber Harpie";
    BoosterPack["TigerAxe"] = "Tiger Axe";
    BoosterPack["GateGuardian"] = "Gate Guardian";
    BoosterPack["GeminiElf"] = "Gemini Elf";
    BoosterPack["LauncherSpider"] = "Launcher Spider";
    BoosterPack["GreatMoth"] = "Great Moth";
    BoosterPack["Garoozis"] = "Garoozis";
    BoosterPack["Relinquished"] = "Relinquished";
    BoosterPack["BattleOx"] = "Battle Ox";
    BoosterPack["BlueEyesToonDragon"] = "Blue-Eyes Toon Dragon";
    BoosterPack["BlackLusterSoldier"] = "Black Luster Soldier";
    BoosterPack["BlueEyesUltimateDragon"] = "Blue-Eyes Ultimate Dragon";
    BoosterPack["BlueMilleniumPuzzle"] = "Blue Millenium Puzzle";
    BoosterPack["MilleniumEye"] = "Millenium Eye";
    BoosterPack["BusterBlader"] = "Buster Blader";
    BoosterPack["GreenMilleniumPuzzle"] = "Green Millenium Puzzle";
    BoosterPack["MultiColoredMilleniumPuzzle"] = "Multi-colored Millenium Puzzle";
    BoosterPack["weeklyYuGiOh1"] = "Set 1";
    BoosterPack["weeklyYuGiOh2"] = "Set 2";
    BoosterPack["Magazine"] = "Yu-Gi-Oh! Magazine";
    BoosterPack["GrandpaCupQualifying"] = "Qualifying Round";
    BoosterPack["GrandpaCupFinal"] = "Final";
})(BoosterPack = exports.BoosterPack || (exports.BoosterPack = {}));
var Rarity;
(function (Rarity) {
    Rarity["Rare"] = "Rare";
    Rarity["Common"] = "Common";
})(Rarity = exports.Rarity || (exports.Rarity = {}));
var CardType;
(function (CardType) {
    CardType["Monster"] = "Monster";
    CardType["Spell"] = "Spell";
    CardType["Trap"] = "Trap";
})(CardType = exports.CardType || (exports.CardType = {}));
var Property;
(function (Property) {
    Property["Normal"] = "Normal";
    Property["Field"] = "Field";
    Property["QuickPlay"] = "Quick-Play";
    Property["Ritual"] = "Ritual";
    Property["Continuous"] = "Continuous";
    Property["Equip"] = "Equip";
    Property["Counter"] = "Counter";
})(Property = exports.Property || (exports.Property = {}));
var MonsterType;
(function (MonsterType) {
    MonsterType["Normal"] = "Normal";
    MonsterType["Effect"] = "Effect";
    MonsterType["Fusion"] = "Fusion";
    MonsterType["Ritual"] = "Ritual";
    MonsterType["Aqua"] = "Aqua";
    MonsterType["Beast"] = "Beast";
    MonsterType["BeastWarrior"] = "Beast-Warrior";
    MonsterType["Dinosaur"] = "Dinosaur";
    MonsterType["DivineBeast"] = "Divine-Beast";
    MonsterType["Dragon"] = "Dragon";
    MonsterType["Fairy"] = "Fairy";
    MonsterType["Fiend"] = "Fiend";
    MonsterType["Fish"] = "Fish";
    MonsterType["Insect"] = "Insect";
    MonsterType["Machine"] = "Machine";
    MonsterType["Plant"] = "Plant";
    MonsterType["Pyro"] = "Pyro";
    MonsterType["Reptile"] = "Reptile";
    MonsterType["Rock"] = "Rock";
    MonsterType["SeaSerpent"] = "Sea Serpent";
    MonsterType["Spellcaster"] = "Spellcaster";
    MonsterType["Thunder"] = "Thunder";
    MonsterType["Warrior"] = "Warrior";
    MonsterType["WingedBeast"] = "Winged Beast";
    MonsterType["Zombie"] = "Zombie";
})(MonsterType = exports.MonsterType || (exports.MonsterType = {}));
var Attribute;
(function (Attribute) {
    Attribute["Dark"] = "DARK";
    Attribute["Divine"] = "DIVINE";
    Attribute["Earth"] = "EARTH";
    Attribute["Fire"] = "FIRE";
    Attribute["Light"] = "LIGHT";
    Attribute["Water"] = "WATER";
    Attribute["Wind"] = "WIND";
})(Attribute = exports.Attribute || (exports.Attribute = {}));
var Status;
(function (Status) {
    Status["Forbidden"] = "Forbidden";
    Status["Limited"] = "Limited";
    Status["SemiLimited"] = "Semi-Limited";
    Status["Unlimited"] = "Unlimited";
})(Status = exports.Status || (exports.Status = {}));
exports.AllowedByStatus = {
    [Status.Forbidden]: 0,
    [Status.Limited]: 1,
    [Status.SemiLimited]: 2,
    [Status.Unlimited]: 3,
};
//# sourceMappingURL=card.interface.js.map