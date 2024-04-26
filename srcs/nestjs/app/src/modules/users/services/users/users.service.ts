import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Equal, Repository } from 'typeorm';
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

    async getUser(displayName: string): Promise<User> {
        const user: User | null = await this.userRepository.findOne({
            where: {
                displayName: Equal(displayName),
            },
        });

        if (!user) throw new NotFoundException(`User ${displayName} not found`);

        return (user);
    }

    async createUser(userDetails: CreateUserDto): Promise<User> {
        const user: User = this.userRepository.create(userDetails);

        await this.userRepository.save(user);
        return (user);
    }

}
