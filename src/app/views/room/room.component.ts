import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MoveClass, Result, Room, Wins } from 'src/app/models/room.model';
import { SocketsService } from 'src/app/services/sockets.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit, OnDestroy {

  constructor(private socketService: SocketsService, private router: Router) { }
  private _roomSub1: Subscription;
  private _roomSub2: Subscription;
  private _roomSub3: Subscription;
  private _roomSub4: Subscription;
  room: Room;
  player: number;
  canplay: boolean;
  wins: Wins = {
    player1: 0,
    player2: 0,
    draws: 0,
  }
  status: string;
  request: boolean;
  needAccept: boolean;

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.router.navigate(['/']);
  }

  ngOnInit() {
    let room: any = localStorage.getItem('room');
    if (!room) {
      this.router.navigate(['/']);
      return
    }
    this.room = JSON.parse(room);
    this.player = this.room.player1 == this.room.socketId ? 1 : 2;
    this.canplay = this.player == this.room.currents[0].player;
    localStorage.setItem('code', this.room.code);
    if (this.room.status == 1) {
      this.status = `TURNO DE: PLAYER ${this.room.currents[0].player}`;
    } else {
      this.status = 'ESPERANDO JUGADORES';
    }
    this._roomSub1 = this.socketService.joinInRoomEvent.subscribe((room: Room) => {
      this.room = room;
      this.status = `TURNO DE: PLAYER ${this.room.currents[0].player}`;
    });
    this._roomSub1 = this.socketService.resultRoomEvent.subscribe((result: Result) => {
      this.room = result.room;
      if (this.room.status != 1) this.canplay = false;
      if (result.winner == 1) {
        this.wins.player1++;
        this.status = 'PLAYER 1 GANA';
      }
      if (result.winner == 2) {
        this.wins.player2++;
        this.status = 'PLAYER 2 GANA';
      }
      if (!result.winner) {
        this.wins.draws++;
        this.status = 'ES UN EMPATE';
      }
    });
    this._roomSub2 = this.socketService.moveInRoomEvent.subscribe((res: MoveClass) => {
      this.room = res.room;
      this.canplay = this.player == this.room.currents[0].player;
      let element = <HTMLInputElement>document.getElementById(res.move.index);
      element.disabled = true;
      this.status = `TURNO DE: PLAYER ${this.room.currents[0].player}`;
      element.value = res.move.current;
    });
    this._roomSub4 = this.socketService.startNewGameEvent.subscribe((room: Room) => {
      this.room = room;
      this.wins = {
        player1: 0,
        player2: 0,
        draws: 0,
      }
      this.needAccept = false;
      this.request = false;
      this.canplay = this.player == this.room.currents[0].player;
      let btns = document.querySelectorAll('.board-btn')
      btns.forEach((btn: any) => {
        btn = <HTMLInputElement>btn;
        btn.value = "";
        btn.disabled = false;
      });
    });
    this._roomSub4 = this.socketService.requestNewGameEvent.subscribe((room: Room) => {
      this.needAccept = true;
    });
    this._roomSub4 = this.socketService.leaveInGameEvent.subscribe((room: Room) => {
      this.room = room;
      this.status = 'ESPERANDO JUGADORES';
      this.startNewGame();
    });
  }

  ngOnDestroy() {
    if (this._roomSub1) this._roomSub1.unsubscribe();
    if (this._roomSub2) this._roomSub2.unsubscribe();
    if (this._roomSub3) this._roomSub3.unsubscribe();
    this.leaveInGame();
    localStorage.removeItem('room');
    localStorage.removeItem('code');
  }

  requestNewGame() {
    this.socketService.requestNewGame(this.room.code);
    this.request = true;
    this._roomSub4 = this.socketService.requestAcceptedEvent.subscribe((room: Room) => {
      this._roomSub4.unsubscribe();
      this.startNewGame();
    });
  }

  requestAccepted() {
    this.socketService.requestAccepted(this.room.code);
  }

  startNewGame() {
    this.socketService.startNewGame(this.room.code);
  }

  leaveInGame() {
    let code = <string>localStorage.getItem('code');
    this.socketService.leaveInGame(code);
  }

  clickFunc(event: Event) {
    if (!this.canplay || this.room.status == 0) return
    let element = <HTMLInputElement>event.target;
    let index = Number(element.id);
    let current = this.room.currents[0].game;
    element.disabled = true;
    element.value = this.room.currents[0].game;
    this.room.cells[index] = this.room.currents[0].game;
    this.status = `TURNO DE: PLAYER ${this.room.currents[1].player}`;
    this.room.currents = this.room.currents.reverse();
    this.canplay = this.player == this.room.currents[0].player;
    this.socketService.moveInRoom(this.room.code, index, current);
  }

}
