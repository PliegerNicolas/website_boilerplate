import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RateLimiterOptions } from 'nestjs-rate-limiter';
import Redis, { RedisOptions } from 'ioredis';

@Injectable()
export class RateLimiterConfigService {

    private readonly redisClient: Redis;

    constructor(private readonly configService: ConfigService) {}

    createRateLimiterOptions(): RateLimiterOptions {
        return ({
            for: 'Express',
            type: 'Memory',
            keyPrefix: 'global',
            points: 4,
            pointsConsumed: 1,
            inmemoryBlockOnConsumed: 0,
            duration: 1,
            blockDuration: 0,
            inmemoryBlockDuration: 0,
            queueEnabled: false,
            whiteList: [],
            blackList: [],
            storeClient: undefined,
            insuranceLimiter: undefined,
            storeType: undefined,
            dbName: undefined,
            tableName: undefined,
            tableCreated: undefined,
            clearExpiredByTimeout: undefined,
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
