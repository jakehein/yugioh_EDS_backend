"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectIsLeft = exports.expectIsRight = exports.makePartial = exports.MikroOrmRepositoryWithFlushMock = exports.MikroOrmRepositoryMock = void 0;
class MikroOrmRepositoryMock {
    constructor() {
        this.entries = [];
    }
    add(e) {
        this.entries.push(e);
    }
    async findAllEntries() {
        return this.entries;
    }
    async findOneEntryOrFail(id) {
        const e = this.entries.find((e) => e._id.equals(id));
        if (!e)
            throw new Error('cannot find entry');
        return await e;
    }
    async findOneEntry(id) {
        const e = this.entries.find((e) => e._id.equals(id));
        if (!e)
            return null;
        return await e;
    }
    remove(e) {
        this.entries = this.entries.filter((checkEntry) => checkEntry !== e);
    }
    persist(e) {
        this.entries.push(e);
    }
}
exports.MikroOrmRepositoryMock = MikroOrmRepositoryMock;
class MikroOrmRepositoryWithFlushMock extends MikroOrmRepositoryMock {
    constructor() {
        super();
        this.flush = jest.fn();
    }
}
exports.MikroOrmRepositoryWithFlushMock = MikroOrmRepositoryWithFlushMock;
const objectThatRaisesExceptionOnAnyPropertyAccess = new Proxy({}, {
    get(_target, p) {
        if ([
            Symbol.toStringTag,
            Symbol.iterator,
            Symbol.for('nodejs.util.inspect.custom'),
            'constructor',
            'length',
            'then',
        ].includes(p))
            return undefined;
        throw new Error(`Accessing property '${String(p)}' that should not be accessed`);
    },
});
function makePartial(ps) {
    const _ = require('lodash');
    const out = _.clone(ps);
    Object.setPrototypeOf(out, objectThatRaisesExceptionOnAnyPropertyAccess);
    return out;
}
exports.makePartial = makePartial;
function expectIsRight(value) {
    expect(value).toStrictEqual({
        _tag: 'Right',
        right: expect.anything(),
    });
}
exports.expectIsRight = expectIsRight;
function expectIsLeft(value) {
    expect(value).toStrictEqual({
        _tag: 'Left',
        left: expect.anything(),
    });
}
exports.expectIsLeft = expectIsLeft;
//# sourceMappingURL=helpers.js.map