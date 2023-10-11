import { ScreenService } from 'src/screen/screen.service';
import IApplication, { IApplicationInfo } from './IApplication';
import { estimateFontSize, text2matrix } from 'text2matrix';
import { FontsService } from 'src/fonts/fonts.service';
import { Color } from 'pixels-matrix';
import { AppLoggerService } from '../app-logger/app-logger.service';

type DateAppOption = {
  font: string;
};

export default class TimeAppBis extends IApplication<DateAppOption> {
  get info(): IApplicationInfo {
    return {
      name: 'TimeAppBis',
      default: true,
    };
  }

  get defaultOption(): DateAppOption {
    return {
      font: 'Pixeled',
    };
  }

  constructor(
    private readonly fontService: FontsService,
    private readonly screenService: ScreenService,
    protected readonly appLoggerService: AppLoggerService,
  ) {
    super();
  }

  private _option: DateAppOption;
  private interval?: NodeJS.Timer;

  public get options(): DateAppOption {
    return this._option;
  }

  async _start(options?: DateAppOption): Promise<void> {
    this._option = options;
    this.interval = setInterval(() => {
      try {
        this.loop();
      } catch (err) {
        this._logger.error(err);
        this.stop(false);
      }
    }, 1000);
  }
  async _stop(): Promise<void> {
    clearInterval(this.interval);
  }

  private loop(): void {
    this.screenService.clear(false);
    const date: Date = new Date(); // get current time

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    const font = this.fontService.getFont(this.options.font);
    if (!font.fontSize) {
      font.fontSize = estimateFontSize(
        font.font,
        this.screenService.resolution.y,
      );
    }

    const hours_matrix = text2matrix(hours, font.font, {
      fontSize: font.fontSize,
      letterSpacing: font.letterSpacing,
    });
    const minutes_matrix = text2matrix(minutes, font.font, {
      fontSize: font.fontSize,
      letterSpacing: font.letterSpacing,
    });
    const hours_width = hours_matrix[0].length;
    const minutes_width = minutes_matrix[0].length;
    const seconds_value = date.getSeconds();
    const minute_value = date.getMinutes();

    const sep = ':';
    const sep_matrix = text2matrix(sep, font.font, {
      fontSize: font.fontSize,
    });
    const sep_width = sep_matrix[0].length;

    let cursor = Math.ceil(
      (this.screenService.resolution.x -
        (hours_width + minutes_width + sep_width)) /
        2,
    );

    this.screenService.setMatrix(
      hours_matrix,
      Color.White,
      { xOffset: cursor },
      false,
    );
    cursor += hours_width;

    cursor += sep_width;
    this.screenService.setMatrix(
      minutes_matrix,
      Color.White,
      { xOffset: cursor },
      false,
    );

    this.screenService.refresh();
  }
}
