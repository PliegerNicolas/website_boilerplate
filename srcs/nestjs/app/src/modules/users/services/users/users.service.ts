import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../models/dtos/create-user.dto';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async getUsers(): Promise<User[]> {
        const users: User[] = await this.userRepository.find();

        return (users);
    }

    async createUser(userDetails: CreateUserDto): Promise<User> {
        const user: User = this.userRepository.create(userDetails);

        await this.userRepository.save(user);
        return (user);
    }

}
