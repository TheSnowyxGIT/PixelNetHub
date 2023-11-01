export abstract class RunnerError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class RunnerAppNotFoundError extends RunnerError {
  constructor(appName: string) {
    super(`App ${appName} does not exist`);
  }
}
