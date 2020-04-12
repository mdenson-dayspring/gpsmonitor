import * as udp from 'dgram';
import { Observable, Subscription } from 'rxjs';
import { print, printError } from '.';

export class UDPServer {
  private server: udp.Socket;
  private subscription: Subscription = (undefined as unknown) as Subscription;

  constructor(private port: number) {
    this.server = udp.createSocket('udp4');
    this.server.bind(() => {
      this.server.setBroadcast(true);
    });

    // emits when any error occurs
    this.server.on('error', error => {
      printError('Error: ' + error);
      this.server.close();
    });

    // emits after the socket is closed using socket.close();
    this.server.on('close', () => {
      print('Socket is closed !');
    });
  }

  public subscribeTo(stream: Observable<string>) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = stream.subscribe(msg => {
      this.server.send(msg, this.port, '255.255.255.255', error => {
        if (error) {
          printError(error.toString());
        }
      });
    });
  }
  public close() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.server.close();
  }
}
