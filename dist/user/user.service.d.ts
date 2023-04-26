import { EntityRepository } from '@mikro-orm/core';
import { User, UserId } from './user.schema';
import { UsersValidationService } from '../user/user-validation.service';
import { UuidService } from '../uuid/uuid.service';
export declare class UserExistsError extends Error {
    firebaseUId: string;
    constructor(firebaseUId: string);
}
export declare function generateAccountId(): Promise<string>;
export declare class UserService {
    private readonly userRepository;
    private readonly usersValidationService;
    private readonly uuidService;
    constructor(userRepository: EntityRepository<User>, usersValidationService: UsersValidationService, uuidService: UuidService);
    createFromFirebase(firebaseUId: string, authTime: number): Promise<User>;
    findById(userId: UserId): Promise<User | null>;
    findByIdOrFail(userId: UserId): Promise<User>;
    findByFirebaseUId(firebaseUId: string): Promise<User | null>;
    findByAccountIdOrFail(accountId: string): Promise<User>;
    findByAccountId(accountId: string): Promise<User | null>;
}
