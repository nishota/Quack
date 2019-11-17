import { ConnectionMode } from '../../environments/const.environment';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';

export class Socket {
    private static url = environment.socketUrl;
    public static Connection;

    // TODO: rxjsで全て記述したい
  static connect(queryString: string) {
    this.Connection = io(this.url,
      {
        query: queryString,
        path: environment.pathString
      });
  }

  static emit(emitName: string, data?: any) {
    this.Connection.emit(emitName, data);
  }

  static on(onName: string): Observable<any> {
    const observable = new Observable(observer => {
      this.Connection.on(onName, (data) => {
        observer.next(data);
      });
      this.Connection.on('connect_error', (err) => {
        const errMsg = 'Connection Error...';
        observer.error(errMsg);
      });
      this.Connection.on('connect_timeout', (err) => {
        const errMsg = 'Connection Timeout...';
        observer.error(errMsg);
      });
    });
    return observable;
  }

  static disconnect() {
    this.emit(ConnectionMode.Disconnect);
  }
}
