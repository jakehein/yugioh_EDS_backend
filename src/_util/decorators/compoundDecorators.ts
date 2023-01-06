/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
  IsInt,
} from 'class-validator';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import { Controller } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { BearerAuthGuard } from '../../auth/bearer-auth.guard';
import { UseInterceptors } from '@nestjs/common';
import { ContentInterceptor } from '../../content-errors';

/**
 * Creates compound Property Decorator for validation of functions/objects
 * nested in an array.
 * @param type the type of data being validated
 * @param isOptional defaulted false for determining if optional
 * @returns new custom PropertyDecoration rule
 */
export function ObjectArrayOfTypeDecorator(
  type: Function,
  isOptional = false,
): PropertyDecorator {
  return applyDecorators(
    ApiProperty({ type: type, required: !isOptional }),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => type),
    ...(isOptional ? [IsOptional()] : []),
  );
}

/**
 * Create compound Property Decorator for validation of string ApiDecorator
 * @param isOptional defaulted false for determining if optional
 * @returns new custom PropertyDecoration rule
 */
export function StringApiDecorator(isOptional = false): PropertyDecorator {
  return applyDecorators(
    IsString(),
    ApiProperty({ required: !isOptional }),
    ...(isOptional ? [IsOptional()] : []),
  );
}

/**
 * Create compound Property Decorator for validation of number ApiDecorator
 * @param isOptional defaulted false for determining if optional
 * @returns new custom PropertyDecoration rule
 */
export function NumberApiDecorator(isOptional = false): PropertyDecorator {
  return applyDecorators(
    IsNumber(),
    ApiProperty({ required: !isOptional }),
    ...(isOptional ? [IsOptional()] : []),
  );
}

/**
 * Create compound Property Decorator for validation of enum ApiDecorator
 * @param enumtype the type of enum being validated
 * @param isOptional defaulted false for determining if optional
 * @returns new custom PropertyDecoration rule
 */
export function EnumApiDecorator(
  enumtype: Object,
  isOptional = false,
): PropertyDecorator {
  return applyDecorators(
    IsEnum(enumtype),
    ApiProperty({ required: !isOptional }),
    ...(isOptional ? [IsOptional()] : []),
  );
}

/**
 * Create compound Property Decorator for validation of Int ApiDecorator
 * @param isOptional defaulted false for determining if optional
 * @returns new custom PropertyDecoration rule
 */
export function IntApiDecorator(isOptional = false): PropertyDecorator {
  return applyDecorators(
    IsInt(),
    ApiProperty({ required: !isOptional }),
    ...(isOptional ? [IsOptional()] : []),
  );
}

export function ControllerDecorator(
  swaggerTag: string,
  controllerPath = '',
): ClassDecorator & MethodDecorator {
  return applyDecorators(
    ApiTags(swaggerTag),
    ApiBearerAuth(),
    Controller(controllerPath),
    UseGuards(BearerAuthGuard),
    UseInterceptors(ContentInterceptor),
  );
}
