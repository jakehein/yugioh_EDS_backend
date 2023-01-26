import {
  EntityRepository,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { generateId } from 'zoo-ids';
import { customAlphabet } from 'nanoid/async';
import { User, UserId } from './user.schema';
import * as assert from 'assert';
import { InjectRepository } from '@mikro-orm/nestjs';
import { UsersValidationService } from '../user/user-validation.service';
import { BoosterPack } from '../card/card.interface';
import { UuidService } from '../uuid/uuid.service';

export class UserExistsError extends Error {
  constructor(public firebaseUId: string) {
    super();

    this.name = 'UserExistsError';
  }
}

export async function generateAccountId() {
  const nanoid = customAlphabet('0123456789', 12);
  const baseString = await nanoid();
  const m = /^(\d{4})(\d{4})(\d{4})$/i.exec(baseString);
  assert(m);

  return `${m[1]}-${m[2]}-${m[3]}`;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly usersValidationService: UsersValidationService,
    private readonly uuidService: UuidService,
  ) {}

  async createFromFirebase(
    firebaseUId: string,
    authTime: number,
  ): Promise<User> {
    const accountId = await generateAccountId();
    const name = generateId();
    const boosters: { uuid: string; contentId: BoosterPack }[] = [];
    Object.values(BoosterPack).forEach((boosterPack) => {
      boosters.push({
        uuid: this.uuidService.getUuid(),
        contentId: boosterPack,
      });
    });
    const user = new User(
      firebaseUId,
      accountId,
      name,
      authTime,
      boosters,
      this.uuidService.getUuid(),
      this.uuidService.getUuid(),
    );
    try {
      await this.userRepository.persistAndFlush(user);
      return user;
    } catch (e) {
      if (e instanceof UniqueConstraintViolationException) {
        const uniqueE: UniqueConstraintViolationException & {
          keyValue?: Partial<User>;
        } = e;

        if (uniqueE.keyValue && uniqueE.keyValue.firebaseUId === firebaseUId) {
          throw new UserExistsError(firebaseUId);
        }
      }
      throw e;
    }
  }

  async findById(userId: UserId): Promise<User | null> {
    const user = await this.userRepository.findOne(userId);
    if (user) this.usersValidationService.validateUserFields(user);
    return user;
  }

  async findByIdOrFail(userId: UserId): Promise<User> {
    const user = await this.userRepository.findOneOrFail(userId);
    this.usersValidationService.validateUserFields(user);
    return user;
  }

  async findByFirebaseUId(firebaseUId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ firebaseUId });
    if (user) this.usersValidationService.validateUserFields(user);
    return user;
  }

  async findByAccountIdOrFail(accountId: string): Promise<User> {
    const user = await this.userRepository.findOneOrFail({ accountId });
    this.usersValidationService.validateUserFields(user);
    return user;
  }

  async findByAccountId(accountId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ accountId });
    if (user) this.usersValidationService.validateUserFields(user);
    return user;
  }
}
