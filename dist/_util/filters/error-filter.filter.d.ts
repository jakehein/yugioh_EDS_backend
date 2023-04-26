import { ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
export declare class ExceptionCatchFilter extends BaseExceptionFilter<Error> {
    constructor(httpAdapterHost: HttpAdapterHost);
    catch(exception: Error, host: ArgumentsHost): void;
}
