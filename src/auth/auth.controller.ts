import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

     @Post('register')
        create(@Body() user: RegisterUserDTO) {
            return this.authService.register(user);
        }
}
