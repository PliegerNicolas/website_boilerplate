import { Module } from '@nestjs/common';
import { AuthenticationController } from './controllers/authentication/authentication.controller';
import { AuthenticationService } from './services/authentication/authentication.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { HashingModule } from 'src/utils/hashing/hashing.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
        UsersModule,
        HashingModule,
        JwtModule,
        PassportModule.registerAsync({
            useFactory: async () => ({
                defaultStrategy: 'jwt',
                session: false,
            }),
        }),
        // Add REDIS to store blacklist.
    ],
    controllers: [AuthenticationController],
    providers: [AuthenticationService],
    exports: [],
})
export class AuthenticationModule {}
