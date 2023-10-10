// import * as ws281x from 'rpi-ws281x';
import { Injectable, Logger } from '@nestjs/common';
import { Socket, io } from 'socket.io-client';
import { Color, PixelMatrix, Point } from 'pixels-matrix';

export abstract class IScreen {
  public abstract render(matrix: PixelMatrix): void;
  protected fn?: () => void;
  public onSetup(fn: () => void): void {
    this.fn = fn;
  }
}

export class Ws281xScreen extends IScreen {
  private ws281x: any;
  private logger = new Logger(Ws281xScreen.name);
  constructor(size: Point, gpio: number) {
    super();
    // @ts-ignore
    import('rpi-ws281x')
      .then((ws281x) => {
        this.ws281x = ws281x;
        this.ws281x.configure({
          brightness: 150,
          gpio: gpio,
          leds: size.x * size.y,
          stripType: 'rgb',
        });
        this.logger.log('Screen ws281x configured');
        this.fn?.();
      })
      .catch(() => {
        this.logger.warn('Screen ws281x not configured');
      });
  }
  public render(matrix: PixelMatrix): void {
    this.ws281x?.render(matrix.ToArray().buffer);
  }
}

export class VirtualWSScreen extends IScreen {
  private logger = new Logger(VirtualWSScreen.name);
  private socket: Socket;
  private connected = false;
  private errorLogged = false;
  constructor(size: Point) {
    super();
    this.socket = io(process.env.WS_URL ?? 'http://localhost:8080');
    this.socket.on('connect', () => {
      this.logger.log('VirtualWSScreen connected');
      this.connected = true;
      this.errorLogged = false;
      this.socket.emit('register', { width: size.x, height: size.y });
      this.fn?.();
    });

    this.socket.on('connect_error', (error) => {
      if (!this.errorLogged) {
        this.logger.warn('VirtualWSScreen connect_error', error);
        this.errorLogged = true;
      }
    });

    this.socket.on('disconnect', (reason) => {
      this.logger.warn('Disconnected:', reason);
      this.connected = false;
    });
  }
  public render(matrix: PixelMatrix): void {
    if (!this.connected) {
      return;
    }
    this.socket.emit('render', matrix.ToArray().buffer);
  }
}

type MatrixOption = {
  xOffset?: number;
};

@Injectable()
export class ScreenService {
  private logger = new Logger(ScreenService.name);
  private matrix_: PixelMatrix;

  private resolution_: Point;
  public get resolution(): Point {
    return this.resolution_;
  }

  private _screen?: IScreen;
  private _virtualScreen?: IScreen;

  constructor() {
    const size = {
      x: Number(process.env.SCREEN_WIDTH ?? 32),
      y: Number(process.env.SCREEN_HEIGHT ?? 8),
    };
    this.logger.log(`Screen size: ${size.x}x${size.y}`);

    this.resolution_ = size;
    this.matrix_ = new PixelMatrix(this.resolution.x, this.resolution.y);

    this._screen = new Ws281xScreen(size, 18);
    this._virtualScreen = new VirtualWSScreen(size);

    this._screen.onSetup(this.refresh.bind(this));
    this._virtualScreen.onSetup(this.refresh.bind(this));
  }

  public clear(refresh = true): void {
    this.fill(Color.Black, refresh);
  }

  public fill(color: Color, refresh = true): void {
    this.matrix_.fillColor(color);
    this.refresh(refresh);
  }

  public setPixel(point: Point, color: Color, refresh = true): void {
    this.matrix_.setColor(point, color);
    this.refresh(refresh);
  }

  public setMatrix(
    grayScale: number[][],
    color: Color,
    option?: MatrixOption,
    refresh = true,
  ): void {
    option = option ?? {};
    option.xOffset = option.xOffset ?? 0;
    for (let y = 0; y < Math.min(grayScale.length, this.resolution_.y); y++) {
      for (
        let x = 0;
        x < Math.min(grayScale[y].length, this.resolution_.x);
        x++
      ) {
        if (grayScale[y][x] > 0) {
          this.setPixel(
            { x: x + option.xOffset, y: y },
            Color.colorWithRatio(color, grayScale[y][x]),
            false,
          );
        }
      }
    }
    this.refresh(refresh);
  }

  public refresh(condition = true): void {
    if (condition) {
      this._screen?.render(this.matrix_);
      this._virtualScreen?.render(this.matrix_);
    }
  }
}
