import { Test, TestingModule } from '@nestjs/testing';
import { BoosterPackService } from './booster-pack.service';

describe('BoosterPackService', () => {
  let service: BoosterPackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoosterPackService],
    }).compile();

    service = module.get<BoosterPackService>(BoosterPackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
