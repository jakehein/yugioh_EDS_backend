import { Module } from '@nestjs/common';
import { UuidService } from './uuid.service';

@Module({
  imports: [],
  providers: [UuidService],
  exports: [UuidService],
})
export class UuidModule {}
