import { Socket } from 'socket.io';

export class ChatHandler {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  handle(): void {
    this.socket.on('message', (data) => {
      console.log(data);
    });
  }
}
