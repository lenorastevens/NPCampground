import Park from "./park.js";

// sort Park List for the state that was selected
export default function sortParksList(stateCode) {
    const parksElement = document.querySelector('.slide');
    parksElement.innerHTML = '';

    // Get parks and states data from local storage if available
    const storedParks = localStorage.getItem("parksData");
    const parksList = storedParks ? JSON.parse(storedParks) : [];

    const storedStates = localStorage.getItem("statesData");
    const statesData = storedStates ? JSON.parse(storedStates) : {};
    
    const stateName = statesData[stateCode];
    const stateTitle = document.getElementById('stateName');
    stateTitle.textContent = `Browse NP Campgrounds in ${stateName}`;

    // backup image if none in array
    const fallbackImage = "images/backupImg.webp";
    
    // iterate through park list and create slides with first image
    parksList.forEach(function (park, index) {
        const imageUrl = park.images[0] ? park.images[0].url : fallbackImage;
       
        //Define the classes variable within the loop
        let classes = ['card'];
        if (index === 0) {
            classes.push('checked'); //add first park as checked
        } else if (index <= 3) {
            classes.push('inactive'); //next 3 parks are inactive
        }else {
            classes.push('hidden'); //the rest of the parks are hidden
        }

        const classAttribute = classes.join(' ');

        // slide template
        const template = `
        <input type="radio" name="slide" id=c${index + 1} ${index === 0 ? 'checked' : ''} >
        <label title="Click a campground name for more information" for=c${index + 1} class="${classAttribute}" style="background-image: url(${imageUrl});">
            <div class="row">
                <div class="icon">${index + 1}</div>
                <h4 class="name"><a href="#" class="park-link" data-park-index="${index}">${park.name}</a></h4>                    
            </div>
        </label>
        `;
        
        parksElement.innerHTML += template;
    });

    runParkSlides();

    // campground slideshow logic
    function runParkSlides() {
        let slideIndex = 0;
        const parkSlides = document.querySelectorAll('.card');
        let checkedIndex = 0;
        let lastIndex = parkSlides.length - 1;

        // logic to display the 4 campground lineup
        function showParks() {
            parkSlides.forEach(function(park, index) {
                park.classList.remove('checked', 'inactive', 'hidden');
                if (index >= slideIndex && index < slideIndex + 4) {
                    park.classList.add('inactive');
                } else {
                    park.classList.add('hidden');
                }
            });

            // Ensure there is always a "checked" park
            if (slideIndex < 0) {
                slideIndex = lastIndex; 
            } else if (slideIndex > lastIndex) {
                slideIndex = 0; 
            }

            if (slideIndex < checkedIndex && checkedIndex < slideIndex + 4) {
                parkSlides[checkedIndex].classList.add('checked');
            } else {
                parkSlides[slideIndex].classList.add('checked');
                document.querySelector(`#c${slideIndex + 1}`).checked = true;
                checkedIndex = slideIndex;
            }
        }

        // Slideshow listeners
        let next = document.querySelector('.next')
        let prev = document.querySelector('.prev')
        let radios = document.querySelectorAll('[name="slide"]');

        next.addEventListener('click', function(){
            slideIndex = (slideIndex + 1) % parkSlides.length;
            showParks();
        });

        prev.addEventListener('click', function(){
            slideIndex = (slideIndex - 1 + parkSlides.length) % parkSlides.length;
            showParks();
        });

        radios.forEach(function(radio, index) {
            radio.addEventListener('click', function() {
                slideIndex = index;
                showParks();
            });
        });

        showParks();

        //link to park class to display selected campground information
        const parkLinks = document.querySelectorAll('.park-link');

        parkLinks.forEach(function (link) {
            link.addEventListener('click', function (event) {
                event.preventDefault(); 

                const parkIndex = parseInt(this.getAttribute('data-park-index'));
                
                const park = parksList[parkIndex];
                const parkDetails = new Park(park); 
                parkDetails.displayParkDetails();
            });
        });
    }
}