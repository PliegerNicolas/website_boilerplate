import { Test, TestingModule } from '@nestjs/testing';
import { RateLimiterConfigService } from './rate-limiter-config.service';

describe('RateLimiterConfigService', () => {
  let service: RateLimiterConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RateLimiterConfigService],
    }).compile();

    service = module.get<RateLimiterConfigService>(RateLimiterConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
