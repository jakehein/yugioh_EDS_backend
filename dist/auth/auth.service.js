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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const auth_1 = require("firebase-admin/auth");
const firebase_service_1 = require("../firebase/firebase.service");
const auth_2 = require("firebase/auth");
function isFirebaseError(error) {
    return (typeof error === 'object' &&
        !!error &&
        typeof error.code === 'string');
}
let AuthService = class AuthService {
    constructor(usersService, firebaseAuth, firebaseService) {
        this.usersService = usersService;
        this.firebaseAuth = firebaseAuth;
        this.firebaseService = firebaseService;
    }
    async getUserCredentials(userCredentialsFunc, body) {
        let jwt;
        try {
            const userCredential = await userCredentialsFunc(this.firebaseService.auth, body.email, body.password);
            if (userCredential) {
                const id = userCredential.user.uid;
                jwt = await this.firebaseAuth.createCustomToken(id);
                return jwt;
            }
            else {
                throw new Error(`jwt could not be created for user ${body.email}`);
            }
        }
        catch (err) {
            throw new common_1.BadRequestException(err);
        }
    }
    async login(body) {
        return {
            jwt: await this.getUserCredentials(auth_2.signInWithEmailAndPassword, body),
        };
    }
    async register(body) {
        return {
            jwt: await this.getUserCredentials(auth_2.createUserWithEmailAndPassword, body),
        };
    }
    async validateUserByToken(token) {
        let decodedToken;
        let validatedIdToken;
        let userCredential;
        try {
            userCredential = await (0, auth_2.signInWithCustomToken)(this.firebaseService.auth, token);
            validatedIdToken = await userCredential.user.getIdToken(true);
            decodedToken = await this.firebaseAuth.verifyIdToken(validatedIdToken);
        }
        catch (err) {
            if (isFirebaseError(err) &&
                (err.code === 'auth/argument-error' ||
                    err.code === 'auth/id-token-expired')) {
                throw new common_1.BadRequestException(err.message);
            }
            throw err;
        }
        let user = await this.usersService.findByFirebaseUId(decodedToken.uid);
        if (!user) {
            user = await this.usersService.createFromFirebase(decodedToken.uid, decodedToken.auth_time);
        }
        if (!user.authTime || user.authTime <= decodedToken.auth_time) {
            user.authTime = decodedToken.auth_time;
        }
        else {
            throw new common_1.UnauthorizedException({
                statusCode: 401,
                message: 'Current user session has timed out.',
            });
        }
        return { decodedToken, user, id: user._id.toHexString() };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('FIREBASE_ADMIN_AUTH')),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_1.Auth,
        firebase_service_1.FirebaseService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map