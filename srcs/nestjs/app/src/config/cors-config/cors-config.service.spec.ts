import { Test, TestingModule } from '@nestjs/testing';
import { CorsConfigService } from './cors-config.service';

describe('CorsConfigService', () => {
  let service: CorsConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CorsConfigService],
    }).compile();

    service = module.get<CorsConfigService>(CorsConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
