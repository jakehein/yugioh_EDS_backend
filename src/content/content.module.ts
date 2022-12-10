//import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
//import { ContentData } from './content.schema';
import { HttpModule } from '@nestjs/axios';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { contentDataProvider } from './content-data.provider';
import { ContentAccessorService } from './content-accessor.service';

@Module({
  imports: [HttpModule], //, MikroOrmModule.forFeature([ContentData])],
  controllers: [ContentController],
  providers: [ContentService, ContentAccessorService, contentDataProvider],
  exports: [ContentService, ContentAccessorService],
})
export class ContentModule {}
