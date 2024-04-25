import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeormConfigService implements TypeOrmOptionsFactory {

    constructor(private readonly configService: ConfigService) {}

    createTypeOrmOptions(connectionName?: string | undefined): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
        return ({
            type: 'postgres',
            host: this.configService.get<string>('database.for_nestjs.host', 'localhost'),
            port: this.configService.get<number>('database.for_nestjs.port', 5432),
            database: this.configService.get<string>('database.for_nestjs.db', 'default'),
            username: this.configService.get<string>('database.for_nestjs.user', 'default'),
            password: this.configService.get<string>('database.for_nestjs.password', 'default'),
            autoLoadEntities: true,
            synchronize: true,
        });
    }

}
