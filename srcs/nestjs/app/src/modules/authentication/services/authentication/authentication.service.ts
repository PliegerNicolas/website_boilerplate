import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/services/users/users.service';
import { HashingService } from 'src/utils/hashing/services/hashing/hashing.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationService {

    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly hashingService: HashingService,
        private readonly jwtService: JwtService,
    ) {}

}
