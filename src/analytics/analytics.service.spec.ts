import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { MikroOrmRepositoryMock, RepoMock } from '../_test_utils_/helpers';
import { AnalyticsService } from './analytics.service';
import { BoosterPullRecord } from './booster-pull-record.schema';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let boosterPullRecordRepositoryMock: RepoMock<BoosterPullRecord>;

  beforeEach(async () => {
    boosterPullRecordRepositoryMock =
      new MikroOrmRepositoryMock<BoosterPullRecord>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(BoosterPullRecord),
          useValue: boosterPullRecordRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
