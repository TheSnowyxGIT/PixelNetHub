export abstract class RunnerError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class RunnerAppNotFoundError extends RunnerError {
  constructor(appName: string, version?: string) {
    super(`App ${appName}${version ? `@${version}` : ''} not found`);
  }
}
