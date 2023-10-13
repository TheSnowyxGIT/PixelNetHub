import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { ValidationError, validate } from 'class-validator';
import { Observable, lastValueFrom } from 'rxjs';

@Injectable()
export class ValidationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ValidationInterceptor.name);

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const dtoResponse = await lastValueFrom(next.handle());

    if (dtoResponse === undefined) {
      return dtoResponse;
    }

    let errors: ValidationError[][] = [];
    if (Array.isArray(dtoResponse)) {
      errors = await Promise.all(dtoResponse.map((dto) => validate(dto)));
    } else {
      errors = [await validate(dtoResponse)];
    }

    for (const error of errors) {
      if (error.length > 0) {
        this.logger.error(
          `Response validation failed for ${context.getClass().name} / ${
            context.getHandler().name
          }`,
        );
        this.logger.error(error);
        // but continue without throwing an error
      }
    }

    return dtoResponse;
  }
}
