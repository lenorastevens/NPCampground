export default class Park {

  // constructor for park class
  constructor(park) {
    this.data = park;
    this.SlideIndex = 1;
  }

  // method to create and display park card puts together template data
  displayParkDetails() {
    const parkCard = document.querySelector(".park-info");
    parkCard.innerHTML = "";

    // assembles park pictures
    const slideshowItems = this.generateSlidesShowItems();

    // makes dots for each picture
    const dots = this.generateDots();

    // get the table template
    const campTable = this.generateCampTable();

    // general NPS url in case there is no url in the data
    const backupUrl = "https://www.nps.gov";

    // campground template assembly
    const parkTemplate = `
            <div class="slideshow-container">
                ${slideshowItems} 
            </div>
            <br>
            <div style="text-align:center">
                ${dots}
            </div>
            <section class="campground-info">
                <div class="details">
                    <h2>${this.data.name || ""}</h2>
                    <a class="links" href="${
                      this.data.url || backupUrl
                    }" target="blank">Directions</a>
                    <a class="links" href="${
                      this.data.reservationUrl || backupUrl
                    }" target="blank">Reservations</a>
                    <a class="links" href="${
                      this.data.regulationsurl || backupUrl
                    }" target="blank">Plan Your Visit</a>
                    <p>${
                      this.data.fees && this.data.fees.length > 0
                        ? `${this.data.fees[0].title}: $${this.data.fees[0].cost}`
                        : ""
                    }</p>
                    <h3>Campground Description</h3>
                    <p>${this.data.description || ""}</p>
                </div>
                <table class="camp-sites">
                    ${campTable}
                </table>
            </section>
        `;

    parkCard.innerHTML = parkTemplate;

    this.runCampSlides();
  }

  // create campground image slides
  generateSlidesShowItems() {
    return this.data.images
      .map(
        (image, index) => ` 
        <div class="mySlides fade">
            <div class="numbertext">${index + 1} / ${
          this.data.images.length
        }</div>
            <img src="${image.url}" alt="${image.altText}" style="width:100%">
            <div class="text">${image.altText}</div>
        </div>
        `
      ).join("");
  }

  // create campground slide dots
  generateDots() {
    return this.data.images
      .map(
        (image, index) => `
        <span id="${image.title}" class="dot" ></span>
        `
      ).join("");
  }

  // create campsite data table
  generateCampTable() {
    const horse = parseInt(this.data.campsites.horse);
    const other = parseInt(this.data.campsites.other);
    const horseAndOtherSum = horse + other;

    // table template
    const tableTemplate = `
        <tr>
            <th>TOTAL SITES:</th>
            <td> ${ this.data.campsites.totalSites } </td>
        </tr>
        <tr>
            <th><img class="site-icon" src="src/images/plugIcon.webp" alt="Plug Icon">Elect Hookups:</th>
            <td> ${ this.data.campsites.electricalHookups } </td>
        </tr>
        <tr>
            <th><img class="site-icon" src="src/images/rvIcon.png" alt="RV Icon">RV Only:</th>
            <td> ${ this.data.campsites.rvOnly } </td>
        </tr>
        <tr>
            <th><img class="site-icon" src="src/images/tentIcon.webp" alt="Tent Icon">Tent Only:</th>
            <td> ${ this.data.campsites.tentOnly } </td>
        </tr>
        <tr>
            <th><img class="site-icon" src="src/images/walkIcon.webp" alt="Walker Icon">Walk / Boat To:</th>
            <td> ${ this.data.campsites.walkBoatTo } </td>
        </tr>
        <tr>
            <th><img class="site-icon" src="src/images/groupIcon.webp" alt="Group Icon">Group:</th>
            <td> ${ this.data.campsites.group } </td>
        </tr>
        <tr>
            <th><img class="site-icon" src="src/images/horseIcon.webp" alt="Horse Icon">Horse & Other:</th>
            <td> ${ horseAndOtherSum.toString() } </td>
        </tr>
        `;
    return tableTemplate;
  }

  // listener for dots to switch images
  runCampSlides() {
    const dots = document.querySelectorAll(".dot");

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => this.currentSlide(index + 1));
    });

    this.showSlides();
  }

  // advance image
  plusSlides(n) {
    this.showSlides((this.SlideIndex += n));
  }

  // go back an image
  currentSlide(n) {
    this.showSlides((this.SlideIndex = n));
  }

  // slideshow logic
  showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (this.SlideIndex > slides.length) {
      this.SlideIndex = 1;
    }
    if (this.SlideIndex < 1) {
      this.SlideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[this.SlideIndex - 1].style.display = "block";
    dots[this.SlideIndex - 1].className += " active";
  }
}
