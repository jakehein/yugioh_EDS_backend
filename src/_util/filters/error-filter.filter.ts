import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';

@Catch()
export class ExceptionCatchFilter extends BaseExceptionFilter<Error> {
  constructor(httpAdapterHost: HttpAdapterHost) {
    super(httpAdapterHost.httpAdapter);
  }

  catch(exception: Error, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
