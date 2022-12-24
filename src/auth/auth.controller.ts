import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../_util/dtos/createUser.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //login controller?
  @Post('login')
  //doublecheck 'User' probably is just login info for a user
  login(@Body() body: CreateUserDto) {
    return this.authService.login(body.email, body.password);
  }

  //register controller?
  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }
}
