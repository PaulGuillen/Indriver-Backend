import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from './dto/create-user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>
    ) { }

    create(user: CreateUserDTO){
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }
}