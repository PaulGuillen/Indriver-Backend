import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RegisterUserDTO } from './dto/register-user.dto';
import { User } from 'src/users/user.entity';
import { LoginUserDTO } from './dto/login-user.dto';
import { compare } from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { Rol } from 'src/roles/rol.entity';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
        @InjectRepository(Rol) private readonly rolesRepository: Repository<Rol>,
        private readonly jwtService: JwtService,
    ) { }

    async login(user: LoginUserDTO) {
        const userExist = await this.usersRepository.findOneBy({ email: user.email });
        const isPasswordValid = await compare(user.password, userExist?.password);

        if (!userExist) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        if (!isPasswordValid) {
            throw new HttpException('Invalid credentials', HttpStatus.FORBIDDEN);
        }

        const payload = { id: userExist.id, name: userExist.name }
        const token = this.jwtService.sign(payload);
        const data = {
            user: userExist,
            token: 'Bearer ' + token
        };

        delete data.user.password;

        return data;
    }

    async register(user: RegisterUserDTO) {
        debugger;
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
        const rolesIds = user.rolesIds;
        const roles = await this.rolesRepository.findBy({ id: In(rolesIds) });
        newUser.roles = roles;
        
        const userSaved = await this.usersRepository.save(newUser);
        const payload = { id: userSaved.id, name: userSaved.name }
        const token = this.jwtService.sign(payload);

        const data = {
            user: userSaved,
            token: 'Bearer ' + token
        };

        delete data.user.password;

        try {
            return data;
        } catch (error) {
            throw new HttpException('Error while registering user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}