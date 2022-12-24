import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketsService } from 'src/app/services/sockets.service';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Room } from 'src/app/models/room.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit, OnDestroy {
  showpass: boolean = false;
  roomPass = new FormControl('');

  constructor(private socketService: SocketsService, private router: Router) { }
  private _roomSub: Subscription;

  ngOnInit() {
    this._roomSub = this.socketService.createEvent.subscribe((room: Room) => {
      localStorage.setItem('room', JSON.stringify(room));
      this.router.navigate(['/room']);
    });
  }

  ngOnDestroy() {
    this._roomSub.unsubscribe();
  }

  newRoom() {
    if(!this.roomPass.value) return;
    this.socketService.createRoom(this.roomPass.value);
  }

}
