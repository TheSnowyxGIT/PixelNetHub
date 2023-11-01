/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Logger } from '@nestjs/common/services/logger.service';
import { PixelMatrix, Point } from 'pixels-matrix';
import { Server, Socket } from 'socket.io';
import { WebSocket } from 'ws';

export abstract class IScreen {
  constructor(protected logger?: Logger) {}
  public abstract render(matrix: PixelMatrix): void;
  protected fn?: () => void;
  public onLoaded(fn: () => void): void {
    this.fn = fn;
  }
}

// export class Ws281xScreen extends IScreen {
//   private ws281x: any;
//   constructor(size: Point, gpio: number, logger?: Logger) {
//     super(logger);
//     // @ts-ignore
//     import('rpi-ws281x')
//       .then((ws281x) => {
//         this.ws281x = ws281x;
//         this.ws281x.configure({
//           brightness: 150,
//           gpio: gpio,
//           leds: size.x * size.y,
//           stripType: 'rgb',
//         });
//         this.logger?.log('Screen ws281x configured');
//         this.fn?.();
//       })
//       .catch(() => {
//         this.logger?.warn('Screen ws281x not configured');
//       });
//   }
//   public render(matrix: PixelMatrix): void {
//     this.ws281x?.render(matrix.ToArray().buffer);
//   }
// }

export class VirtualWSScreen extends IScreen {
  private io: Server;
  private clients: Set<Socket> = new Set();
  constructor(private size: Point, logger?: Logger) {
    super(logger);
    this.io = new Server();
    const port = process.env['VIRTUAL_SCREEN_PORT']
      ? Number(process.env['VIRTUAL_SCREEN_PORT'])
      : 3001;
    this.io.listen(port);
    this.logger?.log(`VirtualWSScreen listening on port ${port}`);

    this.io.on('connection', (socket) => {
      this.logger?.log(`VirtualWSScreen client connected: ${socket.id}`);
      this.clients.add(socket);
      socket.emit('init', { width: this.size.x, height: this.size.y });
      this.fn?.();

      socket.on('disconnect', () => {
        this.logger?.log(`VirtualWSScreen client disconnected: ${socket.id}`);
        this.clients.delete(socket);
      });
    });
  }
  public render(matrix: PixelMatrix): void {
    this.io.emit('render', matrix.ToArray().buffer);
  }
}

export class RemoteWSScreen extends IScreen {
  private ws?: WebSocket;
  private url: string;
  private reconnectIntervalId: any;

  constructor(private size: Point, url: string, logger?: Logger) {
    super(logger);
    this.url = url;
    this.connect();
  }

  private connect(): void {
    this.logger?.log(`RemoteWSScreen will try to connect to ${this.url}`);
    this.ws = new WebSocket(this.url);

    this.ws.onerror = (error) => {
      this.logger?.error(`RemoteWSScreen error: ${error.message}`);
      this.attemptReconnect();
    };

    this.ws.onopen = () => {
      this.logger?.log(`RemoteWSScreen connected to ${this.url}`);
      this.fn?.();
      this.clearReconnectInterval();
    };

    this.ws.onclose = () => {
      this.logger?.log(`RemoteWSScreen disconnected from ${this.url}`);
      this.attemptReconnect();
    };
  }

  private attemptReconnect(): void {
    if (!this.reconnectIntervalId) {
      this.reconnectIntervalId = setInterval(() => this.connect(), 10000);
    }
  }

  private clearReconnectInterval(): void {
    if (this.reconnectIntervalId) {
      clearInterval(this.reconnectIntervalId);
      this.reconnectIntervalId = null;
    }
  }
  public render(matrix: PixelMatrix): void {
    if (this.ws && this.ws.readyState === this.ws.OPEN) {
      this.ws.send(matrix.ToArray().buffer);
    }
  }
}
