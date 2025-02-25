import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

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
        return this.usersRepository.find();
    }

    async update(id: number, user: UpdateUserDTO) {
        const userExist = await this.usersRepository.findOneBy({ id: id });
        if (!userExist) {
            return new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const updateUser = Object.assign(userExist, user);
        return this.usersRepository.save(updateUser);

    }

    async updateWithImage(image: Express.Multer.File) {
        
    }
}