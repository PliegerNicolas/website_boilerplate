import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateLimiterGuard, RateLimiterModule } from 'nestjs-rate-limiter';
import { RateLimiterConfigService } from './rate-limiter-config/rate-limiter-config.service';
import { TypeormConfigService } from './typeorm-config/typeorm-config.service';
import { APP_GUARD } from '@nestjs/core';
import { CorsConfigService } from './cors-config/cors-config.service';
import { ConfigOptions } from './config-options/config-options.config';

@Module({
    imports: [
		ConfigModule.forRoot(ConfigOptions),
		RateLimiterModule.registerAsync({
			imports: [ConfigModule],
			useClass: RateLimiterConfigService,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useClass: TypeormConfigService,
		}),
    ],
    controllers: [],
    providers: [
        CorsConfigService,
        RateLimiterConfigService,
        TypeormConfigService,
        { provide: APP_GUARD, useClass: RateLimiterGuard },
    ],
    exports: [
        ConfigModule,
        RateLimiterModule,
        TypeOrmModule,

        CorsConfigService,
        RateLimiterConfigService,
        TypeormConfigService,
    ],
})
export class ConfigurationModule {}
