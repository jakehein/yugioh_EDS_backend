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
  login(@Body() body: CreateUserDto) {
    return this.authService.login(body);
  }

  //register controller?
  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }
}
