"use strict";
//gets random into between min (inclusive) and max (exclusive) parameters
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

//returns the player unit at given coods
function getUnit(x, y) {
    for (let j = 0; j < units.length; j++){
        if (units[j].x == x && units[j].y == y) {
            return units[j];
        }
    }
    return null;
}

//returns the enemy unit at given coods
function getEnemy(x, y) {
    for (let j = 0; j < enemies.length; j++){
        if (enemies[j].x == x && enemies[j].y == y) {
            return enemies[j];
        }
    }
    return null;
}

//moves given unit from starting coordinates to ending coordinates
function moveUnit(unit, startX, startY, endX, endY) {
    unit.x = endX;
    unit.y = endY;
    document.querySelector(`#x${startX}y${startY}`).innerHTML = `<img src="images/blank.png" alt="blank terrain">`;
    if (unit instanceof Unit) {
        document.querySelector(`#x${endX}y${endY}`).innerHTML = `<img src="images/playerUnit.png" alt="player unit">`;
        unit.moved = true;
    }
    else {
        document.querySelector(`#x${endX}y${endY}`).innerHTML = `<img src ="images/enemyUnit.png" alt="enemy unit">`
    }
    
}

//initiates a battle between two units
function battle(attacker, defender) {
    let string = "";
    let playerAttack = false;
    let damage = 0;
    //start string
    if (attacker instanceof Unit) {
        playerAttack = true;
        string = "<p>Enemy unit lost ";
    }
    else {
        string = "<p>Player unit lost ";
    }
    //attacker damage

    damage = attacker.atk - defender.def;
    if (damage < 0) {
        damage = 0;
    }
    defender.hp -= damage;
    string += `${damage} hp! `;

    //defender damage
    if (defender.hp > 0) {
        damage = defender.atk - attacker.def;
        if (damage < 0) {
            damage = 0;
        }
        attacker.hp -= damage;
        if (playerAttack) {
            string += `Player unit lost ${damage} hp!`;
        }
        else {
            string += `Enemy unit lost ${damage} hp!`;
        }
    }
    //defender dies
    else {
        if (playerAttack) {
            string += `Enemy unit was defeated. </p>`;
            killEnemy(defender);
        }
        else {
            string += `Player unit was defeated. </p>`;
            killUnit(defender);
        }
        document.querySelector("#status").innerHTML += string;
        return;
    }

    //attacker dies
    if (attacker.hp <= 0) {
        if (playerAttack) {
            string += `Player unit was defeated. </p>`;
            killUnit(attacker);
        }
        else {
            string += `Enemy unit was defeated. </p>`;
            killEnemy(attacker);
        }
    }

    document.querySelector("#status").innerHTML += string;
    
}

function killUnit(unit) {
    document.querySelector(`#x${unit.x}y${unit.y}`).innerHTML = `<img src="images/blank.png" alt="blank terrain">`;
    units.splice(units.indexOf(unit), 1);
}

function killEnemy(unit) {
    document.querySelector(`#x${unit.x}y${unit.y}`).innerHTML = `<img src="images/blank.png" alt="blank terrain">`;
    enemies.splice(enemies.indexOf(unit), 1);
}