import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users/users.controller';
import { UsersService } from './services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HashingModule } from 'src/utils/hashing/hashing.module';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        HashingModule,
    ],
    controllers: [UsersController],
    providers: [UsersService, JwtService],
    exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
