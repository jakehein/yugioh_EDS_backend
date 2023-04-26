import { AuthService } from './auth.service';
import { CreateUserDto } from '../_util/dtos/createUser.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: CreateUserDto): Promise<{
        jwt: string;
    }>;
    register(body: CreateUserDto): Promise<{
        jwt: string;
    }>;
}
