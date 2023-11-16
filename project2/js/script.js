// 1
window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};
	
// 2
let displayTerm = "";
	
// 3
function searchButtonClicked(){
	console.log("searchButtonClicked() called");
	//1
	const SERVICE_URL = "https://api.scryfall.com/cards/search";
	//2
	//let GIPHY_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7";
	//3 - build up our own URL string
	let url = SERVICE_URL;
	//url += "api_key=" + GIPHY_KEY;
	//4 - parse the user entered term we wish to search
	let term = document.querySelector("#searchterm").value;
	displayTerm = term;
	//5 - get rid of any leading and trailing spaces
	term = term.trim();
	//6 - encode spaces and special characters
	term = encodeURIComponent(term);
	//7 - if there's no term to search then bail out of the function (return does this)
	if(term.length < 1) return;
	//8 - append the search term to the URL - the parameter name is 'q'
	url += "?q=" + term;
	//9 - grab the user chosen search 'limit' from the <select> and append it to the URL
	//let limit = document.querySelector("#limit").value;
	//url += "&limit=" + limit;
	//10 - update the UI
	document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";
	//11 - see what the URL looks like
	console.log(url);
	// 12 Request data!
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
	//6 - xhr.responseText is the JSON file we just downloaded
	console.log(xhr.responseText);
	//7 - turn the text into a parsable JavaScript object
	let obj = JSON.parse(xhr.responseText);
	//8 - if there are no results, print a message and return
	if (!obj.data || obj.data.length == 0) {
		document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
		return;
	}
	//9 - start building an HTML string we will display to the user
	let results = obj.data;
	console.log("results.length = " + results.length);
	let bigString = "";
	//10 - loop through the arry of results
	for (let i=0;i<results.length;i++) {
		let result = results[i];
		//11 - filter results

		//color
		if (document.querySelector("#color").value != "Any") {
			if (result.color_identity.indexOf(document.querySelector("#color").value) == -1) {
				results.pop(result);
				continue;
			}
		}

		//Converted Mana Cost (CMC)
		if (result.cmc < document.querySelector("#mincmc").value || result.cmc > document.querySelector("#maxcmc").value) {
			results.pop(result);
			continue;
		}

		//12 - get the URL to the GIF
		let smallURL = result.image_uris.large;
		console.log(smallURL);
		if (!smallURL) smallURL = "images/no-image-found.png";
		//13 - Build a <div> to hold each result
		//ES6 String Templating
		let line = `<div class='result'><img src='${smallURL}' title='${result.name}' /></div>`;
		//14 - add the <div> to the `bigString` and loop
		bigString += line;
	}
	//16 - all done building the HTML - show it to the user!
	document.querySelector("#content").innerHTML = bigString;
	//17 - update the status
	document.querySelector("#status").innerHTML = "<b>Success!</b><p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
}
	
function dataError(e) {
	console.log("An error occurred");
}