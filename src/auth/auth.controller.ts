import { Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../_util/dtos/createUser.dto';
import { ApiControllerHeader } from '../_util/decorators/compoundDecorators';

@ApiControllerHeader('Authorize', 'auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: CreateUserDto) {
    return this.authService.login(body);
  }

  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }
}
