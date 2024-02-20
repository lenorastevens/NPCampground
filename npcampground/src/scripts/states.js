// url to json file of countries
const statesURL = "https://lenorastevens.github.io/National-Parks-Campground-Guide/data/states.json"

// fetch request for countries file
async function getState() {
    try {
        const response = await fetch(statesURL);
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('statesData', JSON.stringify(data));
            createStates(data);
        } else {
            throw Error(await response.text());
        }
    } catch (error) {
        console.log(error);
    }
}

// call to initiate request
getState();

function createStates(data) {
    // variable to add data to
    const stateSelect = document.getElementById('state');

    // start with empty value
    stateSelect.innerHTML = '';

    // creating the option element, value, default value and adding to select list
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Select a State';
    stateSelect.add(defaultOption);

    // loop through data to add all countries to the select list
    for (const abbreviation in data) {
        const optionElement = document.createElement('option');
        optionElement.value = abbreviation;
        optionElement.text = data[abbreviation];
        stateSelect.add(optionElement);
    }
}