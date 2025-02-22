import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register-user.dto';
import { LoginUserDTO } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('login')
    login(@Body() user: LoginUserDTO) {
        return this.authService.login(user);
    }

    @Post('register')
    create(@Body() user: RegisterUserDTO) {
        return this.authService.register(user);
    }
}