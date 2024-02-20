// import { API_KEY } from "./config.js";
import sortParksList from "./sort-parks.js";  

const api_key = import.meta.env.API_KEY;

// clear previous loads before starting next search
window.addEventListener('beforeunload', function() {
    localStorage.clear();
});

// listens for a state to be selected, calls the fetch
let stateCode = "";
document.querySelector("#state").addEventListener("input", function () {
    stateCode = this.value;
    const url = `https://developer.nps.gov/api/v1/campgrounds?&limit=100stateCode=${stateCode}&api_key=${api_key}`
    getParks(url);
}); 

//empty list container for the functions to draw on after list has been retrieved and processed
let parksList = [];

// fetch function that takes the state code and NPS url and gets a list of arrays with parks information
async function getParks(url) {
    const response = await fetch(url);
    if (response.ok) {
        const parksData = await response.json();
        parksList = parksData.data;
        saveToLocalStorage(parksList);
        updateParkList();        
    }
}

// local storage
function saveToLocalStorage(data) {
    localStorage.setItem("parksData", JSON.stringify(data));
}

// call the sortPark to display slides if the data is not empty
function updateParkList(){
    // clear park card each time new state is loaded
    const parkCard = document.querySelector(".park-info");
    parkCard.innerHTML = "";
    
    // check if state park list is empty
    if (parksList.length === 0) {
        const stateTitle = document.getElementById('stateName');
        stateTitle.innerHTML = '';

        const storedStates = localStorage.getItem("statesData");
        const statesData = storedStates ? JSON.parse(storedStates) : {};
        const stateName = statesData[stateCode];

        const parksElement = document.querySelector('.slide');
        parksElement.innerHTML = ` No park data available to display for ${stateName}. `;

    } else {
        sortParksList(stateCode);
    }
}

// listen for the fetch and data to get stored
window.addEventListener("load", function() {
    const parksData = localStorage.getItem("parksData");
    if (parksData) {
        parksList = JSON.parse(parksData);
        updateParkList();
    }
});
