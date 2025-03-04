import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './user.entity';
import cloudStorage = require('../utils/cloud_storage')

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>
    ) { }

    create(user: CreateUserDTO) {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }

    findAll() {
        return this.usersRepository.find({ relations: ['roles'] });
    }

    async update(id: number, user: UpdateUserDTO) {
        const userExist = await this.usersRepository.findOneBy({ id: id });
        if (!userExist) {
            return new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const updateUser = Object.assign(userExist, user);
        return this.usersRepository.save(updateUser);

    }

    async updateWithImage(file: Express.Multer.File, id: number, user: UpdateUserDTO) {
        const url = await cloudStorage(file, file.originalname)
        console.log(url)
        if (url === undefined && url === null) {
            return new HttpException('Error uploading image', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const userExist = await this.usersRepository.findOneBy({ id: id });
        if (!userExist) {
            return new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        user.image = url;
        const updateUser = Object.assign(userExist, user);
        return this.usersRepository.save(updateUser);

    }
}