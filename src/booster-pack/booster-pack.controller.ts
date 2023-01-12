import { Controller } from '@nestjs/common';
import { BoosterPackService } from './booster-pack.service';
import { UserService } from '../user/user.service';

@Controller('booster-pack')
export class BoosterPackController {
  constructor(
    private readonly userService: UserService,
    private readonly boosterPackService: BoosterPackService,
  ) {}
}
