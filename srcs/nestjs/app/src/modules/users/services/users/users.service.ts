import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Equal, ILike, Like, Repository } from 'typeorm';
import { CreateUserParams, ReplaceUserParams, UpdateUserParams } from '../../models/types/user.type';
import { GetUsersQueryParams } from '../../models/types/query-params/get-users.type';
import { HashingService } from 'src/utils/hashing/services/hashing/hashing.service';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly hashingService: HashingService,
    ) {}

    /* Controller functions */

    async getUsers(queryParams: GetUsersQueryParams): Promise<User[]> {
        const users: User[] = await this.userRepository.find({
            where: {
                username: queryParams.username ? ILike(`${queryParams.username}%`) : undefined,
                role: queryParams.role ? Equal(queryParams.role) : undefined,
            },
        });

        return (users);
    }

    async getUser(username: string): Promise<User> {
        const user: User | null = await this.findUserByUsername(username);

        if (!user) throw new NotFoundException(`User ${username} not found`);

        return (user);
    }

    async createUser(userDetails: CreateUserParams): Promise<User> {
        const user: User = this.userRepository.create(userDetails);

        return(await this.userRepository.save(user));
    }

    async replaceUser(targetusername: string, userDetails: ReplaceUserParams): Promise<User> {
        const user: User | null = await this.findUserByUsername(targetusername);

        if (!user) throw new NotFoundException(`User ${userDetails.username} not found`);

        return (user);
    }

    async updateUser(targetusername: string, userDetails: UpdateUserParams): Promise<User> {
        const user: User | null = await this.findUserByUsername(targetusername);

        if (!user) throw new NotFoundException(`User ${userDetails.username} not found`);

        return (user);
    }

    async deleteUser(targetusername: string): Promise<string> {
        const user: User | null = await this.findUserByUsername(targetusername);

        if (!user) throw new NotFoundException(`User ${targetusername} not found`);
    
        await this.userRepository.remove(user);
        return (`User ${targetusername} successfully deleted`);
    }

    /* Other functions */

    async findUserByUuid(uuid: string): Promise<User | null> {
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

    async findUserByUsername(username: string): Promise<User | null> {
        const user: User | null = await this.userRepository.findOne({
            where: {
                username: Equal(username),
            }
        });
        
        return (user);
    }

    /* Other */

    async updateRefreshToken(uuid: string, refreshToken: string): Promise<User> {
        const user: User | null = await this.findUserByUuid(uuid);

        if (!user) throw new NotFoundException(`User with UUID: ${uuid} not found.`);

        this.userRepository.merge(user, {
            refreshToken: await this.hashingService.hash(refreshToken),
        });

        return (await this.userRepository.save(user));
    }

}
