import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Room, MoveClass, Result } from 'src/app/models/room.model';

@Injectable({
  providedIn: 'root'
})
export class SocketsService {
  createEvent = this.socket.fromEvent<Room>('create'); // DETECT ROOM CREATED
  joinToRoomEvent = this.socket.fromEvent<Room>('join'); // DETECT JOIN TO ROOM
  joinRefusedEvent = this.socket.fromEvent<Room>('join-refused'); // DETECT JOIN REFUSED
  joinFailedEvent = this.socket.fromEvent<Room>('join-failed'); // DETECT JOIN FAILED
  joinInRoomEvent = this.socket.fromEvent<Room>('room-join'); // DETECT JOIN IN ROOM

  resultRoomEvent = this.socket.fromEvent<Result>('result'); // DETECT RESULT IN GAME
  moveInRoomEvent = this.socket.fromEvent<MoveClass>('move'); // DETECT CLICK IN ROOM

  requestNewGameEvent = this.socket.fromEvent<Room>('request'); // DETECT REQUEST RECIVE
  requestAcceptedEvent = this.socket.fromEvent<Room>('accepted'); // DETECT REQUEST ACCEPTED
  startNewGameEvent = this.socket.fromEvent<Room>('reset'); // DETECT NEW GAME STARTED

  leaveInGameEvent = this.socket.fromEvent<Room>('leave'); // DETECT PLAYER LEAVE IN ROOM

  constructor(private socket: Socket) { }

  createRoom(password: string) {
    this.socket.emit('create', { code: this.roomCode(), password });
  }

  requestNewGame(code: string) {
    this.socket.emit('request', { code });
  }

  requestAccepted(code: string) {
    this.socket.emit('accepted', { code });
  }

  startNewGame(code: string) {
    this.socket.emit('reset', { code });
  }

  leaveInGame(code: string) {
    this.socket.emit('leave', { code });
  }

  joinToRoom(code: string, password: string) {
    this.socket.emit('join', { code, password });
  }

  moveInRoom(code: string, index: number, current: string) {
    this.socket.emit('move', { code, move: { index, current } });
  }

  private roomCode() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 6; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text.toLocaleUpperCase();
  }
}
