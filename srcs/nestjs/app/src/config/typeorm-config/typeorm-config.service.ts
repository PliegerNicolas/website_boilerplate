import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeormConfigService implements TypeOrmOptionsFactory {

    constructor(private readonly configService: ConfigService) {}

    createTypeOrmOptions(connectionName?: string | undefined): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
        return ({
            type: 'postgres',
            host: this.configService.getOrThrow<string>('database.for_nestjs.host'),
            port: this.configService.getOrThrow<number>('database.for_nestjs.port'),
            database: this.configService.getOrThrow<string>('database.for_nestjs.db'),
            username: this.configService.getOrThrow<string>('database.for_nestjs.user'),
            password: this.configService.getOrThrow<string>('database.for_nestjs.password'),
            autoLoadEntities: true,
            synchronize: true,
        });
    }

}
