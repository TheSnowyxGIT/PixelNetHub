import { AppError } from './AppError';

export class AppCheckerError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'AppCheckerError';
  }
}
