import { Injectable } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CorsConfigService {

    constructor(private readonly configService: ConfigService) {}

    getCorsOptions(): CorsOptions {
        return ({
            origin: this.getAllowedOrigins(),
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        });
    }

    getAllowedOrigins(): string[] {
        const domain_name: string = this.configService.get<string>('global.domain_name', 'localhost');
        const frontend_host: string = this.configService.get<string>('frontend.host', 'localhost');
        const frontend_port: string = this.configService.get<string>('frontend.port', '8080');
        const backend_host: string = this.configService.get<string>('backend.host', 'localhost');
        const backend_port: string = this.configService.get<string>('backend.port', '3000');

        return ([
            `https://${domain_name}`,
            `http://${frontend_host}:${frontend_port}`,
            `http://${backend_host}:${backend_port}`,
        ]);
    }

}