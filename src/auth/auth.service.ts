import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDTO } from './dto/register-user.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

    async register(user: RegisterUserDTO) {
        if (!user.email || !user.phone) {
            throw new HttpException('Email and phone are required', HttpStatus.BAD_REQUEST);
        }
        const [emailExist, phoneExist] = await Promise.all([
            this.usersRepository.findOneBy({ email: user.email }),
            this.usersRepository.findOneBy({ phone: user.phone })
        ]);

        if (emailExist) {
            throw new HttpException('Email already exists', HttpStatus.CONFLICT);
        }

        if (phoneExist) {
            throw new HttpException('Phone already exists', HttpStatus.CONFLICT);
        }

        const newUser = this.usersRepository.create(user);

        try {
            return await this.usersRepository.save(newUser);
        } catch (error) {
            throw new HttpException('Error while registering user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}