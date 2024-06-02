import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
	imports: [
        CacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const host = configService.getOrThrow<string>('redis.host');
                const port = configService.getOrThrow<number>('redis.port');
                const username = configService.getOrThrow<string>('redis.username');
                const password = configService.getOrThrow<string>('redis.password');
                return ({
					isGlobal: true,
                    store: redisStore,
                    url: `redis://${username}:${password}@${host}:${port}`,
                });
            },
		}),
	],
	controllers: [],
	providers: [],
	exports: [CacheModule],
})
export class RedisModule {}
