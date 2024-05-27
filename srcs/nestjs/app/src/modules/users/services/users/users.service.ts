import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Equal, Like, Repository } from 'typeorm';
import { CreateUserParams, ReplaceUserParams, UpdateUserParams } from '../../models/types/user.type';
import { GetUsersQueryParams } from '../../models/types/query-params/get-users.type';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    /* Controller functions */

    async getUsers(queryParams: GetUsersQueryParams): Promise<User[]> {
        const users: User[] = await this.userRepository.find({
            where: {
                displayName: queryParams.displayName ? Like(`${queryParams.displayName}%`) : undefined,
                registrationMethod: queryParams.registrationMethod ? Equal(queryParams.registrationMethod) : undefined,
            },
        });

        return (users);
    }

    async getUser(displayName: string): Promise<User> {
        const user: User | null = await this.findUserByDisplayName(displayName);

        if (!user) throw new NotFoundException(`User ${displayName} not found`);

        return (user);
    }

    async createUser(userDetails: CreateUserParams): Promise<User> {
        const user: User = this.userRepository.create(userDetails);

        return(await this.userRepository.save(user));
    }

    async replaceUser(targetDisplayName: string, userDetails: ReplaceUserParams): Promise<User> {
        const user: User | null = await this.findUserByDisplayName(targetDisplayName);

        if (!user) throw new NotFoundException(`User ${userDetails.displayName} not found`);

        return (user);
    }

    async updateUser(targetDisplayName: string, userDetails: UpdateUserParams): Promise<User> {
        const user: User | null = await this.findUserByDisplayName(targetDisplayName);

        if (!user) throw new NotFoundException(`User ${userDetails.displayName} not found`);

        return (user);
    }

    async deleteUser(targetDisplayName: string): Promise<string> {
        const user: User | null = await this.findUserByDisplayName(targetDisplayName);

        if (!user) throw new NotFoundException(`User ${targetDisplayName} not found`);
    
        await this.userRepository.remove(user);
        return (`User ${targetDisplayName} successfully deleted`);
    }

    /* Other functions */

    async findUserById(uuid: string): Promise<User | null> {
        const user: User | null = await this.userRepository.findOne({
            where: {
                uuid: Equal(uuid),
            }
        });
        
        return (user);
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const user: User | null = await this.userRepository.findOne({
            where: {
                email: Equal(email),
            }
        });
        
        return (user);
    }

    async findUserByDisplayName(displayName: string): Promise<User | null> {
        const user: User | null = await this.userRepository.findOne({
            where: {
                displayName: Equal(displayName),
            }
        });
        
        return (user);
    }

}
