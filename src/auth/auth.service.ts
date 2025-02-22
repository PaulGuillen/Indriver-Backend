import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { RegisterUserDTO } from './dto/register-user.dto';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }

    register(user: RegisterUserDTO) {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }
} 