import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis, RedisOptions } from 'ioredis';
import { RateLimiterOptions } from 'nestjs-rate-limiter';

@Injectable()
export class RateLimiterConfigService {

    private readonly redisClient: Redis;
    private readonly logger = new Logger(RateLimiterConfigService.name);

    constructor(private readonly configService: ConfigService) {
        const redisOptions: RedisOptions = {
            host: this.configService.getOrThrow<string>('redis.host'),
            port: this.configService.getOrThrow<number>('redis.port'),
            username: this.configService.getOrThrow<string>('redis.user'),
            password: this.configService.getOrThrow<string>('redis.password'),
        };

        try {
            this.redisClient = new Redis(redisOptions);
        } catch(error) {
            this.logger.error(`Failed to connect to Redis: ${error.message}`);
            throw error;
        }
    }

    createRateLimiterOptions(): RateLimiterOptions {
        return ({
            for: 'Express',
            type: 'Redis',
            keyPrefix: '',
            points: 4,
            pointsConsumed: 1,
            inmemoryBlockOnConsumed: 0,
            duration: 1,
            blockDuration: 0,
            inmemoryBlockDuration: 0,
            queueEnabled: false,
            whiteList: [],
            blackList: [],
            storeClient: this.redisClient,
            execEvenly: false,
            execEvenlyMinDelayMs: undefined,
            indexKeyPrefix: {},
            maxQueueSize: 100,
            omitResponseHeaders: false,
            errorMessage: 'Rate limit exceeded',
            logger: true,
            customResponseSchema: undefined
        })
    };

}
