import { Injectable } from '@nestjs/common';
import { FeatureRunnerService } from 'libs/runner/feature-runner/src';

@Injectable()
export class AppService {
  constructor(private readonly runnerService: FeatureRunnerService) {
    this.main();
  }

  async main() {
    // const fonts = await this.fontPublicService.getAllFontsData();
    // console.log(fonts);
    // if (fonts.length > 0) {
    //   const font = await this.fontPublicService.getFont(fonts[0].name);
    //   console.log(font);
    // }
    this.runnerService.startLocalApp('customApps/time-app');
  }
}
