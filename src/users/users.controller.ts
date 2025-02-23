import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/jwt-auth.guard';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }
    
    @Post()
    create(@Body() user: CreateUserDTO) {
        return this.usersService.create(user);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(){
        return this.usersService.findAll();
    }
}