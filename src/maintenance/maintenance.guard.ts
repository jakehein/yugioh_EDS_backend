import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class MaintenanceGuard {
  constructor(private readonly reflector: Reflector) {}
}
