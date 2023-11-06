import { Injectable } from '@nestjs/common';
import { FeatureRunnerService } from 'libs/runner/feature-runner/src';

@Injectable()
export class AppService {
  constructor(private readonly featureRunnerService: FeatureRunnerService) {
    this.main();
  }

  async main() {
    // setTimeout(async () => {
    //   this.featureRunnerService.startFromDownloadedApps('time-app');
    // }, 1000);
  }
}
