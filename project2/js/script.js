
window.onload = (e) => {
	document.querySelector("#search").onclick = searchButtonClicked
	//load local storage data
	document.querySelector("#searchterm").value = localStorage.getItem("searchterm");
	document.querySelector("#textterm").value = localStorage.getItem("textterm");
};
	

let displayTerm = "";

function searchButtonClicked(){

	const SERVICE_URL = "https://api.scryfall.com/cards/search";
	//build up our own URL string
	let url = SERVICE_URL;
	//parse the user entered term we wish to search
	let term = document.querySelector("#searchterm").value;
	displayTerm = term;
	//add card text search
	if (document.querySelector("#textterm").value.length > 0) {
		term += " o:\"" + document.querySelector("#textterm").value + "\"";
	}

	//set local storage values
	localStorage.setItem("searchterm", document.querySelector("#searchterm").value);
	localStorage.setItem("textterm", document.querySelector("#textterm").value);

	//get rid of any leading and trailing spaces
	term = term.trim();
	//encode spaces and special characters
	term = encodeURIComponent(term);
	//if there's no term to search then bail out of the function
	if(term.length < 1) {
		document.querySelector("#status").innerHTML = "<b>No search term given.</b>"
		return;
	} 
	//append the search term to the URL - the parameter name is 'q'
	url += "?q=" + term;
	// update the UI
	document.querySelector("#status").innerHTML = "<b>Searching...</b>"
	//Request data
	getData(url);
	
}
 function getData(url) {
	//1 - create a new XHR object
	let xhr = new XMLHttpRequest();
	//2 - set the onload handler
	xhr.onload = dataLoaded;
	//3 - set the onerror handler
	xhr.onerror = dataError;
	//4 - open connection and send the request
	xhr.open("GET", url);
	xhr.send();
}
//callback functions
function dataLoaded(e) {
	//5 - event.target is the xhr object
	let xhr = e.target;
	//7 - turn the text into a parsable JavaScript object
	let obj = JSON.parse(xhr.responseText);
	//8 - if there are no results, print a message and return
	if ((!obj.data) || (obj.data.length == 0) || (obj.code == "not_found" || obj.code == "bad_request" || obj.object == "error" )) {
		document.querySelector("#status").innerHTML = "<b>No results found.</b>";
		return;
	}
	//9 - start building an HTML string we will display to the user
	let results = obj.data;

	let bigString = "";
	//10 - loop through the arry of results
	for (let i=0;i<results.length;i++) {
		let result = results[i];
		//11 - filter results

		//color
		const colors = ["W", "U", "B", "R", "G"]
		let containsColor = false;
		for (let j=0;j<5;j++) {
			
			if (result.color_identity.indexOf(colors[j]) != -1) {
				if (document.querySelector("#color" + j).checked) {
					containsColor = true
				}
			}
		}
		if (!containsColor && result.color_identity.length > 0) {
			continue;
		}

		//types
		const types = ["Artifact", "Battle", "Creature", "Enchantment", "Instant", "Land", "Legendary", "Planeswalker", "Sorcery"]
		let containsType = false;
		for (let j=0;j<9;j++) {
			if (result.type_line.includes(types[j])) {
				if (document.querySelector("#type"+j).checked) {
					containsType = true;
				}
			}
		}
		if (!containsType) {
			continue;
		}



		
		//Converted Mana Cost (CMC)
		if (result.cmc < document.querySelector("#mincmc").value || result.cmc > document.querySelector("#maxcmc").value) {
			continue;
		}

		//12 - get the URL for card images
		if (result.layout == "transform" || result.layout == "modal_dfc") {
			let smallURL = result.card_faces[0].image_uris.large;
			if (!smallURL) smallURL = "images/no-image-found.png";
			bigString += `<div class='result'><img src='${smallURL}' title='${result.name}' />`;
			smallURL = result.card_faces[1].image_uris.large;
			if (!smallURL) smallURL = "images/no-image-found.png";
			bigString += `<p>Card Backside</p><img src='${smallURL}' title='${result.name}' /></div>`;
			
		}
		else {
			let smallURL = result.image_uris.large;
			if (!smallURL) smallURL = "images/no-image-found.png";
			//13 - Build a <div> to hold each result
			//ES6 String Templating
			bigString += `<div class='result'><img src='${smallURL}' title='${result.name}' /></div>`;
		}
		
	}
	//16 - all done building the HTML - show it to the user!
	document.querySelector("#content").innerHTML = bigString;
	//17 - update the status
	document.querySelector("#status").innerHTML = "<b>Success!</b>";
}
	
//displays if error occurs
function dataError(e) {
	document.querySelector("#status").innerHTML = "<b>DATA ERROR!</b>";
}

//displays color checkboxes
let colorexpanded = false;

function showColorCheckboxes() {
  let checkboxes = document.querySelector("#colorcheckboxes");
  if (!colorexpanded) {
    checkboxes.style.display = "block";
    colorexpanded = true;
  } else {
    checkboxes.style.display = "none";
    colorexpanded = false;
  }
}

//displays type checkboxes
let typeexpanded = false;

function showTypeCheckboxes() {
  let checkboxes = document.querySelector("#typecheckboxes");
  if (!typeexpanded) {
    checkboxes.style.display = "block";
    typeexpanded = true;
  } else {
    checkboxes.style.display = "none";
    typeexpanded = false;
  }
}