// // Definition of Search class
// class Search {
//   // Constructor of the class, where we initialize our class variables and setup event listeners
//   constructor() {

//     this.addSearchHTML();
//     // Selecting the DOM elements required for the Search class functionality
//     this.resultsDiv = document.querySelector("#search-overlay__results");
//     this.openButton = document.querySelector(".js-search-trigger-mikkel"); //! ændre på et tidspunkt
//     this.closeButton = document.querySelector(".search-overlay__close");
//     this.searchOverlay = document.querySelector(".search-overlay");
//     this.searchField = document.querySelector("#search-term");

//     // Calling the events function to attach event listeners
//     this.events();

//     // Initializing state variables
//     this.isOverlayOpen = false;
//     this.isSpinnerVisible = false;
//     this.previousValue;
//     this.typingTimer;
//   }

//   // Function to setup event listeners
//   events() {
//     // Attaching click event listeners to openButton and closeButton
//     this.openButton.addEventListener('click', this.openOverlay.bind(this));
//     this.closeButton.addEventListener('click', this.closeOverlay.bind(this));

//     // Attaching a keydown event listener to the document, and a keyup event listener to searchField
//     document.addEventListener("keydown", this.keyPressDispatcher.bind(this));
//     this.searchField.addEventListener("keyup", this.typingLogic.bind(this));
//   }

//   // Function handling logic for when typing occurs in search field
//   typingLogic() {
//     // Checking if current value in searchField is different from the previous value
//     if (this.searchField.value !== this.previousValue) {
//       // Clearing the timer for the getResults function call
//       clearTimeout(this.typingTimer)

//       // If there is a value in the searchField
//       if (this.searchField.value) {
//         // If spinner is not visible, make it visible
//         if (!this.isSpinnerVisible) {
//           this.resultsDiv.innerHTML = '<div class="spinner-loader"> </div>';
//           this.isSpinnerVisible = true;
//         }

//         // Setting a timeout for the getResults function call
//         this.typingTimer = setTimeout(this.getResults.bind(this), 750);

//       } else {
//         // If searchField is empty, clear the resultsDiv and hide the spinner
//         this.resultsDiv.innerHTML = '';
//         this.isSpinnerVisible = false;
//       }

//       // Update the previousValue to current value in searchField
//       this.previousValue = this.searchField.value;
//     }
//   }

//   /* //! using wp built in search
//     getResults() {
//       // Define an async function that fetches from URLs and generates HTML
//       const fetchURLs = async () => {
//         // Define the endpoints to fetch from
//         const endpoints = ['/wp-json/wp/v2/posts', '/wp-json/wp/v2/pages'];
//         // Get the current search value
//         const searchValue = this.searchField.value;
//         // Destructure the root_url from universityData
//         const { root_url } = universityData;
//         // Construct the full URLs by appending each endpoint to the root_url and adding the search query
//         const endpointURLs = endpoints.map(endpoint => `${root_url}${endpoint}/?search=${searchValue}`);


//         try {
//           // Fetch from all URLs concurrently and wait for all responses
//           const responses = await Promise.all(endpointURLs.map(url => fetch(url)));
//           // Parse each response as JSON concurrently and wait for all data
//           const data = await Promise.all(responses.map(response => response.json()));
//           // If every endpoint returned no results, display a no-results message
//           if (data.every(endpointData => endpointData.length === 0)) {
//             this.resultsDiv.innerHTML = '<p>No General Information Matches That Search<p>';
//             return;
//           }

//           // Generate the HTML for the results
//           const html = `
//             <h2 class="search-overlay__section-title">General Information</h2>
//             <ul class="link-list min-list">
//               ${data.map(endpointData => endpointData.map(({ link, authorName, type, title: { rendered } }) => `<li><a href="${link}">${rendered}</a> ${type == "post" ? `by ${authorName}` : ''} </li>`).join('')).join('')}
//             </ul>
//           `;

//           // Insert the HTML into resultsDiv
//           this.resultsDiv.innerHTML = html;
//         } catch (error) {
//           // If any fetches or JSON parsing failed, log the error
//           console.error('There has been a problem with your fetch operation:', error);
//         }

//         // Regardless of whether fetching was successful, hide the spinner
//         this.isSpinnerVisible = false;
//       };

//       // Call the async function
//       fetchURLs();
//     }
//   */


//   async getResults() {
//     try {
//       const response = await fetch(`${universityData.root_url}/wp-json/university/v1/search?term=${this.searchField.value}`);

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const results = await response.json();

//       console.warn(results, "results");

//       this.resultsDiv.innerHTML = `
//         <div class="row">
//             <div class="one-third">
//                 <h2 class="search-overlay__section-title">General Information</h2>
//                 ${results.generalInfo.length ? '<ul class="link-list min-list">' : '<p>No general information matches that text</p>'}
//                 ${results.generalInfo.map(item => `<li><a href="${item.permalink}">${item.title}</a> ${item.postType == 'post' ? `by ${item.authorName}` : ''}  </li>`).join('')}
//             ${results.generalInfo.length ? '</ul>' : ''}
//             </div>
//             <div class="one-third">
//                 <h2 class="search-overlay__section-title">Programs</h2>
//                 ${results.programs.length ? '<ul class="link-list min-list">' : `<p> No programs matches that search. <a href="${universityData.root_url}/programs">View all programs</a></p>`}
//                 ${results.programs.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join('')}
//             ${results.programs.length ? '</ul>' : ''}

//                 <h2 class="search-overlay__section-title">Professors</h2>
//                  ${results.professors.length ? '<ul class="professor-cards">' : `<p> No professors matches that search. </p>`}
//                 ${results.professors.map(item => `
//                   <li class="professor-card__list-item">
//                     <a class="professor-card" href="${item.permalink}">
//                       <img class="professor-card__image" src="${item.image}" alt="">
//                       <span class="professor-card__name">
//                        ${item.title}
//                       </span>
//                     </a>
//                   </li>
//                 `).join('')}
//             ${results.professors.length ? '</ul>' : ''}

//             </div>
//             <div class="one-third">
//                 <h2 class="search-overlay__section-title">Campuses</h2>
//                 ${results.campuses.length ? '<ul class="link-list min-list">' : `<p>No campuses match that search. <a href="${universityData.root_url}/campuses">View all campuses</a></p>`}
//                 ${results.campuses.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join('')}
//                 ${results.campuses.length ? '</ul>' : ''}

//                 <h2 class="search-overlay__section-title">Events</h2>
//                 ${results.events.length ? '' : `<p>No events match that search. <a href="${universityData.root_url}/events">View all events</a></p>`}
//                 ${results.events.map(item => `
//                    <div class="event-summary">
//                       <a class="event-summary__date t-center" href="${item.permalink}">
//                         <span class="event-summary__month">
//                         ${item.month}
//                         </span>
//                         <span class="event-summary__day">
//                           ${item.day}
//                         </span>
//                       </a>
//                       <div class="event-summary__content">
//                         <h5 class="event-summary__title headline headline--tiny"><a
//                             href="${item.permalink}>">${item.title}</a></h5>
//                         <p>
//                           ${item.description} <a href="${item.permalink}>" class="nu gray">Learn more</a>
//                         </p>
//                       </div>
//                     </div>
//                 `).join('')}

//             </div>

//         </div> 
//       `
//     } catch (error) {
//       this.resultsDiv.innerHTML = `Unexpected Error: ${error}`;
//     }

//     this.isSpinnerVisible = false;
//   }



//   // Function to handle specific key press events
//   keyPressDispatcher(e) {
//     // If 'Escape' key is pressed and the search overlay is open, close the overlay
//     if (e.key === 'Escape' && this.isOverlayOpen) {
//       this.closeOverlay();
//     }
//   }

//   // Function to open the search overlay
//   openOverlay() {
//     // Add specific classes to show the search overlay and prevent body scrolling
//     this.searchOverlay.classList.add("search-overlay--active");

//     this.searchField.value = "";

//     setTimeout(() => this.searchField.focus(), 301);

//     document.body.classList.add("body-no-scroll");
//     this.isOverlayOpen = true;
//   }

//   // Function to close the search overlay
//   closeOverlay() {
//     // Remove specific classes to hide the search overlay and enable body scrolling
//     this.searchOverlay.classList.remove("search-overlay--active");
//     document.body.classList.remove("body-no-scroll");
//     this.isOverlayOpen = false;
//   }


//   addSearchHTML() {
//     $("body").append(`
//     <div class="search-overlay">
//       <div class="search-overlay__top">
//         <div class="container">
//           <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
//           <input type="text" class="search-term" placeholder="What are you looking for?" id="search-term">
//           <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
//         </div>
//       </div>

//       <div class="container">
//         <div id="search-overlay__results"></div>
//       </div>

//     </div>
//     `);
//   }


// }

// // Export the Search class as a module
// export default Search;







// new version

class Search {
  // Constructor function runs automatically when a new object is created from this class
  constructor() {
    // Adds the search HTML to the page
    this.addSearchHTML()

    // Initializes properties with DOM elements for future manipulation
    this.resultsDiv = document.querySelector("#search-overlay__results")
    this.openButton = document.querySelectorAll(".js-search-trigger")
    this.closeButton = document.querySelector(".search-overlay__close")
    this.searchOverlay = document.querySelector(".search-overlay")
    this.searchField = document.querySelector("#search-term")

    // Initializes properties for state management
    this.isOverlayOpen = false
    this.isSpinnerVisible = false
    this.previousValue
    this.typingTimer

    // Adds event listeners for user actions
    this.events()
  }

  // This method attaches event listeners for search open, close, typing and key press events
  events() {
    // For each search open button
    this.openButton.forEach(el => {
      // Attach a click event listener
      el.addEventListener("click", e => {
        e.preventDefault()
        this.openOverlay()
      })
    })

    // Attach a click event listener to the search close button
    this.closeButton.addEventListener("click", () => this.closeOverlay())

    // Attach a keydown event listener to the whole document
    document.addEventListener("keydown", e => this.keyPressDispatcher(e))

    // Attach a keyup event listener to the search field
    this.searchField.addEventListener("keyup", () => this.typingLogic())
  }

  // This method handles the search logic (determines when to trigger a new search or to display a loading spinner)
  typingLogic() {
    // If the value in the search field has changed
    if (this.searchField.value != this.previousValue) {
      // Clear the existing typing timer
      clearTimeout(this.typingTimer)

      // If the search field is not empty
      if (this.searchField.value) {
        // If the loading spinner is not visible yet
        if (!this.isSpinnerVisible) {
          // Display the loading spinner
          this.resultsDiv.innerHTML = '<div class="spinner-loader"></div>'
          this.isSpinnerVisible = true
        }
        // Set a new typing timer (delay search for 750ms)
        this.typingTimer = setTimeout(this.getResults.bind(this), 750)
      } else {
        // If the search field is empty, clear the results and hide the loading spinner
        this.resultsDiv.innerHTML = ""
        this.isSpinnerVisible = false
      }
    }

    // Remember the current value in the search field for the next time this method runs
    this.previousValue = this.searchField.value
  }

  // This method retrieves search results from a REST API and displays them in the page
  async getResults() {
    // Send a GET request to the search endpoint of the REST API
    try {
      const response = await fetch(`${universityData.root_url}/wp-json/university/v1/search?term=${this.searchField.value}`);

      // If the request failed (status code is not in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // If the request succeeded, parse the response body from JSON to an object
      const results = await response.json();

      // Process the search results (display them in the page)
      console.warn(results, "results");

      this.resultsDiv.innerHTML = `
        <div class="row">
            <div class="one-third">
                <h2 class="search-overlay__section-title">General Information</h2>
                ${results.generalInfo.length ? '<ul class="link-list min-list">' : '<p>No general information matches that text</p>'}
                ${results.generalInfo.map(item => `<li><a href="${item.permalink}">${item.title}</a> ${item.postType == 'post' ? `by ${item.authorName}` : ''}  </li>`).join('')}
            ${results.generalInfo.length ? '</ul>' : ''}
            </div>
            <div class="one-third">
                <h2 class="search-overlay__section-title">Programs</h2>
                ${results.programs.length ? '<ul class="link-list min-list">' : `<p> No programs matches that search. <a href="${universityData.root_url}/programs">View all programs</a></p>`}
                ${results.programs.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join('')}
            ${results.programs.length ? '</ul>' : ''}

                <h2 class="search-overlay__section-title">Professors</h2>
                 ${results.professors.length ? '<ul class="professor-cards">' : `<p> No professors matches that search. </p>`}
                ${results.professors.map(item => `
                  <li class="professor-card__list-item">
                    <a class="professor-card" href="${item.permalink}">
                      <img class="professor-card__image" src="${item.image}" alt="">
                      <span class="professor-card__name">
                       ${item.title}
                      </span>
                    </a>
                  </li>
                `).join('')}
            ${results.professors.length ? '</ul>' : ''}

            </div>
            <div class="one-third">
                <h2 class="search-overlay__section-title">Campuses</h2>
                ${results.campuses.length ? '<ul class="link-list min-list">' : `<p>No campuses match that search. <a href="${universityData.root_url}/campuses">View all campuses</a></p>`}
                ${results.campuses.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join('')}
                ${results.campuses.length ? '</ul>' : ''}

                <h2 class="search-overlay__section-title">Events</h2>
                ${results.events.length ? '' : `<p>No events match that search. <a href="${universityData.root_url}/events">View all events</a></p>`}
                ${results.events.map(item => `
                   <div class="event-summary">
                      <a class="event-summary__date t-center" href="${item.permalink}">
                        <span class="event-summary__month">
                        ${item.month}
                        </span>
                        <span class="event-summary__day">
                          ${item.day}
                        </span>
                      </a>
                      <div class="event-summary__content">
                        <h5 class="event-summary__title headline headline--tiny"><a
                            href="${item.permalink}">${item.title}</a></h5>
                        <p>
                          ${item.description} <a href="${item.permalink}" class="nu gray">Learn more</a>
                        </p>
                      </div>
                    </div>
                `).join('')}

            </div>

        </div> 
      `
    } catch (error) {
      this.resultsDiv.innerHTML = `Unexpected Error: ${error}`;
    }

    // Hide the loading spinner
    this.isSpinnerVisible = false;
  } catch(error) {
    // If an error occurred, display an error message
    this.resultsDiv.innerHTML = `Unexpected Error: ${error}`;
    this.isSpinnerVisible = false;
  }


  // This method handles the global key press events (open/close search)
  keyPressDispatcher(e) {
    // If the "s" key was pressed, and the search overlay is not open yet, and the currently focused element is not an input field or a textarea
    if (e.keyCode == 83 && !this.isOverlayOpen && document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "TEXTAREA") {
      // Open the search overlay
      this.openOverlay()
    }

    // If the "esc" key was pressed and the search overlay is open
    if (e.keyCode == 27 && this.isOverlayOpen) {
      // Close the search overlay
      this.closeOverlay()
    }
  }

  // This method opens the search overlay
  openOverlay() {
    // Add the active class to the search overlay
    this.searchOverlay.classList.add("search-overlay--active")

    // Add the no-scroll class to the body
    document.body.classList.add("body-no-scroll")

    // Clear the search field
    this.searchField.value = ""

    // Focus the search field
    setTimeout(() => this.searchField.focus(), 301)

    // Set the state of the search overlay to open
    this.isOverlayOpen = true

    // Prevent the default action
    return false
  }

  // This method closes the search overlay
  closeOverlay() {
    // Remove the active class from the search overlay
    this.searchOverlay.classList.remove("search-overlay--active")

    // Remove the no-scroll class from the body
    document.body.classList.remove("body-no-scroll")

    // Set the state of the search overlay to closed
    this.isOverlayOpen = false
  }

  // This method adds the search HTML to the page
  addSearchHTML() {
    // Add a search overlay div to the end of the body
    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div class="search-overlay">
        <div class="search-overlay__top">
          <div class="container">
            <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
            <input type="text" class="search-term" placeholder="What are you looking for?" id="search-term">
            <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
          </div>
        </div>
        
        <div class="container">
          <div id="search-overlay__results"></div>
        </div>

      </div>
    `
    )
  }
}

export default Search
