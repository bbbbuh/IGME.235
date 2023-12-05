"use strict";

window.onload = gameStart;

function gameStart() {
    let gridString = "";
    for(let i = 0;i<10;i++) {
    for(let j = 0;j<10;j++) {
        gridString += `<div class="gridbox" id="${j},${i}"><img src="images/stripes.png" alt="blank terrain"></div>`
    }
    }
    document.querySelector("#grid").innerHTML = gridString;
}
