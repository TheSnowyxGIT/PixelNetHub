import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { validate } from 'class-validator';
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

    const errors = await validate(dtoResponse);

    if (errors.length > 0) {
      this.logger.error(
        `Response validation failed for ${context.getClass().name} / ${
          context.getHandler().name
        }`,
      );
      this.logger.error(errors);
      // but continue without throwing an error
    }

    return instanceToPlain(dtoResponse, {
      excludeExtraneousValues: true,
    }) as any;
  }
}
