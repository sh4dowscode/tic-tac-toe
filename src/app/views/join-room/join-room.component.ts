import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Room } from 'src/app/models/room.model';
import { SocketsService } from 'src/app/services/sockets.service';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.css']
})
export class JoinRoomComponent implements OnInit, OnDestroy {
  showpass: boolean = false;
  roomCode = new FormControl('');
  roomPass = new FormControl('');

  constructor(private socketService: SocketsService, private router: Router) { }
  private _roomSub1: Subscription;
  private _roomSub2: Subscription;
  private _roomSub3: Subscription;

  ngOnInit() {
    this._roomSub1 = this.socketService.joinToRoomEvent.subscribe((room: Room) => {
      localStorage.setItem('room', JSON.stringify(room));
      this.router.navigate(['/room']);
    });
    this._roomSub2 = this.socketService.joinRefusedEvent.subscribe((room: Room) => {
      console.log('JOIN REFUSED');
      alert('REFUSED');
    });
    this._roomSub3 = this.socketService.joinFailedEvent.subscribe((room: Room) => {
      console.log('JOIN FAILED');
      alert('FAILED');
    });
  }

  ngOnDestroy() {
    this._roomSub1.unsubscribe();
    this._roomSub2.unsubscribe();
    this._roomSub3.unsubscribe();
  }

  joinToRoom() {
    if(!this.roomPass.value || !this.roomCode.value) return;
    this.socketService.joinToRoom(this.roomCode.value, this.roomPass.value);
  }

}
