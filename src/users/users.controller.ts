import { Body, Controller, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { UpdateUserDTO } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { JwtRolesGuard } from 'src/auth/jwt/jwt-roles.guard';
import { HasRoles } from 'src/auth/jwt/has-roles';
import { JwtRole } from 'src/auth/jwt/jwt-role';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    @Post()
    create(@Body() user: CreateUserDTO) {
        return this.usersService.create(user);
    }

    @HasRoles(JwtRole.ADMIN)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @HasRoles(JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDTO) {
        return this.usersService.update(id, user);
    }
    
    @HasRoles(JwtRole.CLIENT)
    @UseGuards(JwtAuthGuard, JwtRolesGuard)
    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('file'))
    upload(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
                new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
            ],
        }),
    )
        file: Express.Multer.File,
        @Param('id', ParseIntPipe) id: number,
        @Body() user: UpdateUserDTO,
    ) {
        return this.usersService.updateWithImage(file, id, user);
    }
}