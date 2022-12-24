import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './views/main/main.component';
import { RoomComponent } from './views/room/room.component';
import { CreateComponent } from './views/create/create.component';
import { JoinRoomComponent } from './views/join-room/join-room.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule } from '@angular/forms';

const config: SocketIoConfig = { url: environment.socketURI, options: { transports: ['websocket', 'polling', 'flashsocket'] } };

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    RoomComponent,
    CreateComponent,
    JoinRoomComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
