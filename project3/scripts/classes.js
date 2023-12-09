"use strict";

class Unit {
    constructor(x, y, atk, def, hp, mov, moved, acted) {
        this.x = x;
        this.y = y;
        this.atk = atk;
        this.def = def;
        this.hp = hp;
        this.mov = mov;
        this.moved = moved;
        this.acted = acted;
    }
}

class Enemy {
    constructor(x, y, atk, def, hp, mov) {
        this.x = x;
        this.y = y;
        this.atk = atk;
        this.def = def;
        this.hp = hp;
        this.mov = mov;
    }
}

class Obstacle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}