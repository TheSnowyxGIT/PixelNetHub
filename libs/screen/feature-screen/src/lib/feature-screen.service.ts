import { Injectable, Logger } from '@nestjs/common';
import * as pm from 'pixels-matrix';
import { IScreen, RemoteWSScreen } from 'libs/screen/screens/src';
import {
  Color,
  IScreenService,
  Point,
  SetMatrixOption,
} from 'packages/application/src';

@Injectable()
export class FeatureScreenService implements IScreenService {
  private screens_: IScreen[] = [];
  private logger = new Logger(FeatureScreenService.name);
  private matrix_: pm.PixelMatrix;

  private resolution_: Point;
  public get resolution(): Point {
    return this.resolution_;
  }

  constructor() {
    // TODO: dynamically get size
    const size = {
      x: Number(32),
      y: Number(8),
    };
    this.logger.log(`Screen size: ${size.x}x${size.y}`);
    this.resolution_ = size;
    this.matrix_ = new pm.PixelMatrix(this.resolution.x, this.resolution.y);

    this.screens_ = [
      // new VirtualWSScreen(size, this.logger),
      new RemoteWSScreen(size, 'ws://192.168.1.6:8080', this.logger),
    ];

    for (const screen of this.screens_) {
      screen.onLoaded(() => {
        this.logger.log(`Screen loaded: ${screen.constructor.name}`);
        this.refresh.bind(this);
      });
    }
  }

  private getColor(color: Color): pm.Color {
    if (typeof color === 'string') {
      return pm.Color.FromHEX(color);
    } else if (Array.isArray(color)) {
      return new pm.Color(color[0], color[1], color[2]);
    } else {
      return pm.Color.FromUint32(color);
    }
  }

  clear(refresh?: boolean | undefined): void {
    this.fill('#000000', refresh);
  }

  fill(color: Color, refresh?: boolean | undefined): void {
    this.matrix_.fillColor(this.getColor(color));
    this.refresh(refresh);
  }
  setPixel(point: Point, color: Color, refresh?: boolean | undefined): void {
    this.matrix_.setColor(point, this.getColor(color));
    this.refresh(refresh);
  }
  setMatrix(
    grayScale: number[][],
    color: Color,
    option?: SetMatrixOption | undefined,
    refresh?: boolean | undefined,
  ): void {
    this.matrix_.setMatrix(grayScale, this.getColor(color), option);
    this.refresh(refresh);
  }
  refresh(condition?: boolean | undefined): void {
    if (condition) {
      for (const screen of this.screens_) {
        screen.render(this.matrix_);
      }
    }
  }
}
