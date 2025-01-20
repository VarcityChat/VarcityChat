/* eslint-disable @typescript-eslint/no-unused-vars */
import { Socket } from 'socket.io';

export class ChatHandler {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  handle(): void {
    this.socket.on('new-message', (data) => {
      console.log(data);
    });

    this.socket.on('typing', (data) => {});

    this.socket.on('message-read', (data) => {});
  }
}
