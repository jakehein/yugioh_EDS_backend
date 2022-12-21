import { Controller, Get, UseGuards } from '@nestjs/common';
import { ContentService } from './content.service';
import { BearerAuthGuard } from '../auth/bearer-auth.guard';
import { CaslAbilityHandlers, CaslGuard } from '../auth/casl.guard';
import { ContentData } from './content.schema';

@Controller('content')
@UseGuards(BearerAuthGuard, CaslGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  @CaslAbilityHandlers((ability) => ability.can('read', ContentData))
  get() {
    return this.contentService.get();
  }
}
