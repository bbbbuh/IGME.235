"use strict";

window.onload = gameStart;

const State = {
    Player: "player",
    Action: "action",
    Enemy: "enemy"
}

let units = [];
let enemies = [];
let gridBoxes = [];
let selectedUnit = null;
let state = State.Player;
let battlingUnit = null;


//run function to set up game
function gameStart() {
    //create grid
    let gridString = "";
    for(let i = 0;i<10;i++) {
        for(let j = 0;j<10;j++) {
            gridString += `<div class="gridbox" id="x${j}y${i}"><img src="images/blank.png" alt="blank terrain"></div>`
        }
    }
    document.querySelector("#grid").innerHTML = gridString;

    //add test units
    units.push(new Unit(9, 9, getRandomInt(3,8), getRandomInt(1,6), getRandomInt(7,15), getRandomInt(1,4), false, false));
    units.push(new Unit(8, 9, getRandomInt(3,8), getRandomInt(1,6), getRandomInt(7,15), getRandomInt(1,4), false, false));
    units.push(new Unit(8, 8, getRandomInt(3,8), getRandomInt(1,6), getRandomInt(7,15), getRandomInt(1,4), false, false));
    units.push(new Unit(9, 8, getRandomInt(3,8), getRandomInt(1,6), getRandomInt(7,15), getRandomInt(1,4), false, false));
    let numEnemies = getRandomInt(4,9);
    for (let i = 0; i < numEnemies; i++) {
        let posX = getRandomInt(0,8);
        let posY = getRandomInt(0,8);
        while (getEnemy(posX, posY) != null) {
            posX = getRandomInt(0,8);
            posY = getRandomInt(0,8);
        }
        enemies.push(new Enemy(posX,posY, getRandomInt(3,8), getRandomInt(1,6), getRandomInt(7,15), getRandomInt(1,4)));
    }

    //add all images to units
    for (let i = 0; i < units.length;i++) {
        document.querySelector(`#x${units[i].x}y${units[i].y}`).innerHTML = `<img src="images/playerUnit.png" alt="player unit">`;
    }
    //add all images to enemies
    for (let i = 0; i < enemies.length;i++) {
        document.querySelector(`#x${enemies[i].x}y${enemies[i].y}`).innerHTML = `<img src="images/enemyUnit.png" alt="enemy unit">`;
    }

    //add grid click event to all grid boxes
    gridBoxes = document.querySelectorAll(".gridbox");
    for (let i = 0; i< gridBoxes.length;i++) {
        gridBoxes[i].onclick = gridClick;
    }
}

//allow for selecting gridboxes logic
function gridClick() {
    let gridX = parseInt(this.id.charAt(1));
    let gridY = parseInt(this.id.charAt(3));

    //move player units
    if (this.style.borderColor == "blue") {
        moveUnit(selectedUnit, selectedUnit.x, selectedUnit.y, gridX, gridY);
    }

    //check if unit is in this box
    let unitFound = false;
    for (let i = 0; i < units.length;i++) {
        if (units[i].x == gridX && units[i].y == gridY) {
            selectedUnit = units[i];
            unitFound = true; 
        }
    }
    //check if enemy is in the box
    for (let i = 0; i< enemies.length;i++) {
        if (enemies[i].x == gridX && enemies[i].y == gridY) {
            selectedUnit = enemies[i];
            unitFound = true;
        }
    }

    //player phase attack
    if (this.style.borderColor == "red" && this.innerHTML == `<img src="images/enemyUnit.png" alt="enemy unit">` && state == State.Action) {
        console.log("attack");
        //resets status
        document.querySelector("#status").innerHTML = "<p>Player Phase:</p>";

        //battle enemy
        battle(battlingUnit, selectedUnit);

        //end units turn
        battlingUnit.acted = true;
        document.querySelector("#actionsbox").innerHTML = "";
        battlingUnit = null;
    }

    //remove previous colors
    for (let i = 0; i< gridBoxes.length;i++) {
        gridBoxes[i].style.borderColor = "black";
    }

    //set new select color
    this.style.borderColor = "yellow";

    //reset selected unit
    if (!unitFound) {
        document.querySelector("#stats").innerHTML = `<p>Stats:</p>`;
        document.querySelector("#actionsbox").innerHTML = "";
        selectedUnit = null;
    }
    //display enemy movement range
    else if (selectedUnit instanceof Enemy && state == State.Player) {
        let q = [];
        q.push([selectedUnit.x,selectedUnit.y]);
        let currentCoords = [selectedUnit.x,selectedUnit.y];
        //loops until checked coords are outside of unit's movement range
        while (Math.abs(currentCoords[0] - selectedUnit.x) + Math.abs(currentCoords[1] - selectedUnit.y) < selectedUnit.mov + 1) {
            currentCoords = q.shift();
            //once current coords reaches the edge break
            if (Math.abs(currentCoords[0] - selectedUnit.x) + Math.abs(currentCoords[1] - selectedUnit.y) == selectedUnit.mov + 1) {
                break;
            }
            if (currentCoords[0] + 1 < 10) {
                if (document.querySelector(`#x${currentCoords[0] + 1}y${currentCoords[1]}`).innerHTML == `<img src="images/blank.png" alt="blank terrain">`) {
                    q.push([currentCoords[0]+1,currentCoords[1]]);
                    document.querySelector(`#x${currentCoords[0] + 1}y${currentCoords[1]}`).style.borderColor = "red";
                } 
            }
            if (currentCoords[0] - 1 > -1) {
                if (document.querySelector(`#x${currentCoords[0] - 1}y${currentCoords[1]}`).innerHTML == `<img src="images/blank.png" alt="blank terrain">`) {
                    q.push([currentCoords[0]-1,currentCoords[1]]);
                    document.querySelector(`#x${currentCoords[0] - 1}y${currentCoords[1]}`).style.borderColor = "red";
                }
            }
            if (currentCoords[1] - 1 > -1) {
                if (document.querySelector(`#x${currentCoords[0]}y${currentCoords[1] - 1}`).innerHTML == `<img src="images/blank.png" alt="blank terrain">`) {
                    q.push([currentCoords[0],currentCoords[1] - 1]);
                    document.querySelector(`#x${currentCoords[0]}y${currentCoords[1] - 1}`).style.borderColor = "red";
                } 
            }
            if (currentCoords[1] + 1 < 10) {
                if (document.querySelector(`#x${currentCoords[0]}y${currentCoords[1] + 1}`).innerHTML == `<img src="images/blank.png" alt="blank terrain">`) {
                    q.push([currentCoords[0],currentCoords[1] + 1]);
                    document.querySelector(`#x${currentCoords[0]}y${currentCoords[1] + 1}`).style.borderColor = "red";
                } 
            }
        }
    }
    //player unit movement display
    else if (!selectedUnit.moved && !selectedUnit.acted && state == State.Player){
        let q = [];
        q.push([selectedUnit.x,selectedUnit.y]);
        let currentCoords = [selectedUnit.x,selectedUnit.y];
        //loops until checked coords are outside of unit's movement range
        while (Math.abs(currentCoords[0] - selectedUnit.x) + Math.abs(currentCoords[1] - selectedUnit.y) < selectedUnit.mov + 1 && q.length > 0) {
            currentCoords = q.shift();
            //once current coords reaches the edge break
            if (Math.abs(currentCoords[0] - selectedUnit.x) + Math.abs(currentCoords[1] - selectedUnit.y) == selectedUnit.mov) {
                break;
            }
            if (currentCoords[0] + 1 < 10) {
                if (document.querySelector(`#x${currentCoords[0] + 1}y${currentCoords[1]}`).innerHTML == `<img src="images/blank.png" alt="blank terrain">`) {
                    q.push([currentCoords[0]+1,currentCoords[1]]);
                    if(Math.abs(currentCoords[0] + 1 - selectedUnit.x) + Math.abs(currentCoords[1] - selectedUnit.y) == selectedUnit.mov + 1) {
                        document.querySelector(`#x${currentCoords[0] + 1}y${currentCoords[1]}`).style.borderColor = "red";
                    }
                    else {
                        document.querySelector(`#x${currentCoords[0] + 1}y${currentCoords[1]}`).style.borderColor = "blue";
                    }
                } 
            }
            if (currentCoords[0] - 1 > -1) {
                if (document.querySelector(`#x${currentCoords[0] - 1}y${currentCoords[1]}`).innerHTML == `<img src="images/blank.png" alt="blank terrain">`) {
                    q.push([currentCoords[0]-1,currentCoords[1]]);
                    if(Math.abs(currentCoords[0] - 1 - selectedUnit.x) + Math.abs(currentCoords[1] - selectedUnit.y) == selectedUnit.mov + 1) {
                        document.querySelector(`#x${currentCoords[0] - 1}y${currentCoords[1]}`).style.borderColor = "red";
                    }
                    else {
                        document.querySelector(`#x${currentCoords[0] - 1}y${currentCoords[1]}`).style.borderColor = "blue";
                    }
                } 
            }
            if (currentCoords[1] - 1 > -1) {
                if (document.querySelector(`#x${currentCoords[0]}y${currentCoords[1] - 1}`).innerHTML == `<img src="images/blank.png" alt="blank terrain">`) {
                    q.push([currentCoords[0],currentCoords[1] - 1]);
                    if(Math.abs(currentCoords[0] - selectedUnit.x) + Math.abs(currentCoords[1] - 1 - selectedUnit.y) == selectedUnit.mov + 1) {
                        document.querySelector(`#x${currentCoords[0]}y${currentCoords[1] - 1}`).style.borderColor = "red";
                    }
                    else {
                        document.querySelector(`#x${currentCoords[0]}y${currentCoords[1] - 1}`).style.borderColor = "blue";
                    }
                } 
            }
            if (currentCoords[1] + 1 < 10) {
                if (document.querySelector(`#x${currentCoords[0]}y${currentCoords[1] + 1}`).innerHTML == `<img src="images/blank.png" alt="blank terrain">`) {
                    q.push([currentCoords[0],currentCoords[1] + 1]);
                    if(Math.abs(currentCoords[0] - selectedUnit.x) + Math.abs(currentCoords[1] + 1 - selectedUnit.y) == selectedUnit.mov + 1) {
                        document.querySelector(`#x${currentCoords[0]}y${currentCoords[1] + 1}`).style.borderColor = "red";
                    }
                    else {
                        document.querySelector(`#x${currentCoords[0]}y${currentCoords[1] + 1}`).style.borderColor = "blue";
                    }
                } 
            }
        }
    }

    //display stats and actions menu
    if (selectedUnit != null) {
        //display stats
        document.querySelector("#stats").innerHTML = `<h1>Stats: HP:${selectedUnit.hp} Atk:${selectedUnit.atk} 
        Def:${selectedUnit.def} Move:${selectedUnit.mov}</h1>`
        //add action button to actions menu
        if (selectedUnit instanceof Unit && !selectedUnit.acted) {
            document.querySelector("#actionsbox").innerHTML = `<div class="actionbutton" id="action"><h1>Actions</h1></div>`;
            document.querySelector("#action").onclick = actionsButton;
        } else {
            document.querySelector("#actionsbox").innerHTML = "";
            state = State.Player;
        }
        
    }

    let allActed = true;
    for (let i = 0; i < units.length;i++) {
        if (units[i].acted == false) {
            allActed = false; 
        }
    }
    if (allActed) {
        state = State.Enemy;
        //run enemy phase and return to player phase 
        enemyPhase();
        state = State.Player;
    }
}

//move enemies towards units and attack
function enemyPhase() {
    //update status
    document.querySelector("#status").innerHTML = "<p>Enemy Phase:</p>";

    //breadth first search for each enemy to find and navigate to player in range if none found enemy doesnt move
    for (let i = 0; i < enemies.length;i++) {
        let q = [];
        q.push([enemies[i].x,enemies[i].y]);
        let currentCoords = [enemies[i].x,enemies[i].y];
        //loops until checked coords are outside of unit's movement range
        while (Math.abs(currentCoords[0] - enemies[i].x) + Math.abs(currentCoords[1] - enemies[i].y) <= enemies[i].mov) {
            currentCoords = q.shift();
            //once current coords reaches the edge break
            if (Math.abs(currentCoords[0] - enemies[i].x) + Math.abs(currentCoords[1] - enemies[i].y) == enemies[i].mov + 1) {
                break;
            }
            if (currentCoords[0] + 1 < 10) {
                if (document.querySelector(`#x${currentCoords[0] + 1}y${currentCoords[1]}`).innerHTML == `<img src="images/playerUnit.png" alt="player unit">`) {
                    moveUnit(enemies[i], enemies[i].x, enemies[i].y, currentCoords[0], currentCoords[1]);
                    battle(enemies[i], getUnit(currentCoords[0] + 1, currentCoords[1]));
                    break;
                }
                else if (document.querySelector(`#x${currentCoords[0] + 1}y${currentCoords[1]}`).innerHTML == `<img src="images/blank.png" alt="blank terrain">`) {
                    q.push([currentCoords[0]+1,currentCoords[1]]);
                } 
            }
            if (currentCoords[0] - 1 > -1) {
                if (document.querySelector(`#x${currentCoords[0] - 1}y${currentCoords[1]}`).innerHTML == `<img src="images/playerUnit.png" alt="player unit">`) {
                    moveUnit(enemies[i], enemies[i].x, enemies[i].y, currentCoords[0], currentCoords[1]);
                    battle(enemies[i], getUnit(currentCoords[0] - 1, currentCoords[1]));
                    break;
                }
                else if (document.querySelector(`#x${currentCoords[0] - 1}y${currentCoords[1]}`).innerHTML == `<img src="images/blank.png" alt="blank terrain">`) {
                    q.push([currentCoords[0]-1,currentCoords[1]]);
                } 
            }
            if (currentCoords[1] - 1 > -1) {
                if (document.querySelector(`#x${currentCoords[0]}y${currentCoords[1] - 1}`).innerHTML == `<img src="images/playerUnit.png" alt="player unit">`) {
                    moveUnit(enemies[i], enemies[i].x, enemies[i].y, currentCoords[0], currentCoords[1]);
                    battle(enemies[i], getUnit(currentCoords[0], currentCoords[1] - 1));
                    break;
                }
                else if (document.querySelector(`#x${currentCoords[0]}y${currentCoords[1] - 1}`).innerHTML == `<img src="images/blank.png" alt="blank terrain">`) {
                    q.push([currentCoords[0],currentCoords[1] - 1]);
                } 
            }
            if (currentCoords[1] + 1 < 10) {
                if (document.querySelector(`#x${currentCoords[0]}y${currentCoords[1] + 1}`).innerHTML == `<img src="images/playerUnit.png" alt="player unit">`) {
                    moveUnit(enemies[i], enemies[i].x, enemies[i].y, currentCoords[0], currentCoords[1]);
                    battle(enemies[i], getUnit(currentCoords[0], currentCoords[1] + 1));
                    break;
                }
                else if (document.querySelector(`#x${currentCoords[0]}y${currentCoords[1] + 1}`).innerHTML == `<img src="images/blank.png" alt="blank terrain">`) {
                    q.push([currentCoords[0],currentCoords[1] + 1]);
                } 
            }
        }
    }

    //resets movement of all player units
    for (let i = 0; i < units.length;i++) {
        units[i].moved = false;
        units[i].acted = false;
    }
}

//Actions menu

//this function is called when the actions button is pressed
function actionsButton() {
    state = State.Action;

    //add new buttons
    document.querySelector("#actionsbox").innerHTML = `<div class="actionbutton" id="attack"><h1>Attack</h1></div>`;
    document.querySelector("#actionsbox").innerHTML += `<div class="actionbutton" id="wait"><h1>Wait</h1></div>`;
    document.querySelector("#actionsbox").innerHTML += `<div class="actionbutton" id="back"><h1>Back</h1></div>`;
    document.querySelector("#attack").onclick = attackButton;
    document.querySelector("#wait").onclick = waitButton;
    document.querySelector("#back").onclick = backButton;

    //reset board
    for (let i = 0; i< gridBoxes.length;i++) {
        gridBoxes[i].style.borderColor = "black";
    }



}

//player phase battle logic
function attackButton() {
    document.querySelector("#actionsbox").innerHTML = `<h1>Select unit to attack.</h1><div class="actionbutton" id="back"><h1>Back</h1></div>`;
    document.querySelector("#back").onclick = backButton;

    if (selectedUnit.x + 1 < 10) {
        document.querySelector(`#x${selectedUnit.x + 1}y${selectedUnit.y}`).style.borderColor = "red";
    }
    if (selectedUnit.x - 1 > -1) {
        document.querySelector(`#x${selectedUnit.x - 1}y${selectedUnit.y}`).style.borderColor = "red";
    }
    if (selectedUnit.y - 1 > -1) {
        document.querySelector(`#x${selectedUnit.x}y${selectedUnit.y - 1}`).style.borderColor = "red";
    }
    if (selectedUnit.y + 1 < 10) {
        document.querySelector(`#x${selectedUnit.x}y${selectedUnit.y + 1}`).style.borderColor = "red";
    }

    battlingUnit = selectedUnit;
    
    
}

//function runs when wait button is pressed
function waitButton() {
    selectedUnit.acted = true;
    document.querySelector("#actionsbox").innerHTML = "";
    //reset board
    //remove previous colors
    for (let i = 0; i< gridBoxes.length;i++) {
        gridBoxes[i].style.borderColor = "black";
    }
    let allActed = true;
    for (let i = 0; i < units.length;i++) {
        if (units[i].acted == false) {
            allActed = false; 
        }
    }
    if (allActed) {
        state = State.Enemy;
        //run enemy phase and return to player phase 
        enemyPhase();
    }
    state = State.Player;
}

//returns to playerphase and goes back in the menu
function backButton() {
    document.querySelector("#actionsbox").innerHTML = `<div class="actionbutton" id="action"><h1>Actions</h1></div>`;
    document.querySelector("#action").onclick = actionsButton;
    //reset board
    for (let i = 0; i< gridBoxes.length;i++) {
        gridBoxes[i].style.borderColor = "black";
    }
    state = State.Player;
}