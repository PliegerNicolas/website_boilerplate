import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Equal, ILike, Repository } from 'typeorm';
import { CreateUserParams, ReplaceUserParams, UpdateUserParams } from '../../models/types/user/user.type';
import { GetUsersQueryParams } from '../../models/types/query-params/get-users.type';
import { HashingService } from 'src/utils/hashing/services/hashing/hashing.service';
import { RegistrationMethodParams } from '../../models/types/registration-method/registration-method.type';
import { RegistrationProvider } from '../../models/enums/registration-provider.enum';
import { RegistrationMethod } from '../../entities/registration-method.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(RegistrationMethod)
        private readonly registrationMethodRepository: Repository<RegistrationMethod>,

        private readonly hashingService: HashingService,
    ) {}

    /* Controller functions */

    async getUsers(queryParams: GetUsersQueryParams): Promise<User[]> {
        const users: User[] = await this.userRepository.find({
            where: {
                username: queryParams.username ? ILike(`${queryParams.username}%`) : undefined,
                serverRole: queryParams.serverRole ? Equal(queryParams.serverRole) : undefined,
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

    async replaceUser(targetUsername: string, userDetails: ReplaceUserParams): Promise<User> {
        const user: User | null = await this.findUserByUsername(targetUsername);

        if (!user) throw new NotFoundException(`User ${userDetails.username} not found`); 

        if (userDetails.password) {
            userDetails.password = await this.hashingService.hash(userDetails.password);
            user.registrationMethod.provider = RegistrationProvider.LOCAL;
            user.registrationMethod.identifier = userDetails.password;
        }

        this.userRepository.merge(user, userDetails);
        return (await this.userRepository.save(user));
    }

    async updateUser(targetUsername: string, userDetails: UpdateUserParams): Promise<User> {
        const user: User | null = await this.findUserByUsername(targetUsername);

        if (!user) throw new NotFoundException(`User ${userDetails.username} not found`);

        if (userDetails.password) {
            userDetails.password = await this.hashingService.hash(userDetails.password);
            user.registrationMethod.provider = RegistrationProvider.LOCAL;
            user.registrationMethod.identifier = userDetails.password;
        }

        console.log(user);
        this.userRepository.merge(user, userDetails);
        console.log(user);
        return (await this.userRepository.save(user));
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
            },
            relations: ['registrationMethod'],
        });
        
        return (user);
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const user: User | null = await this.userRepository.findOne({
            where: {
                email: Equal(email),
            },
            relations: ['registrationMethod'],
        });
        
        return (user);
    }

    async findUserByUsername(username: string): Promise<User | null> {
        const user: User | null = await this.userRepository.findOne({
            where: {
                username: Equal(username),
            },
            relations: ['registrationMethod'],
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
