import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }
    
    @Post()
    create(@Body() user: CreateUserDTO) {
        return this.usersService.create(user);
    }
}