export class Room {
    code: string; // ROOM CODE (ID)
    password: string; // ROOM PASSWORD
    cells: any[]; // CELLS IN GAME
    currents: Array<Current>; // PLAYER CURRENT "X" OR "O"
    player1: string; // SOCKET ID
    player2: string; // SOCKET ID
    winner: number; // DRAW = 0; PLAYER 1 = 1; PLAYER 2 = 2;
    status: number;
    socketId: string | null;
    rounds: number;
}

export class Current {
    player: number;
    game: string;
}

export class Wins {
    player1: number;
    player2: number;
    draws: number;
}

export class MoveClass {
    room: Room;
    move: {
        index: string;
        current: string;
    }
}

export class Result {
    room: Room;
    winner: number | null;
}