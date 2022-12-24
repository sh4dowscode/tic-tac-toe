import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './views/create/create.component';
import { JoinRoomComponent } from './views/join-room/join-room.component';
import { MainComponent } from './views/main/main.component';
import { RoomComponent } from './views/room/room.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'join', component: JoinRoomComponent },
  { path: 'create', component: CreateComponent },
  { path: 'room', component: RoomComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
