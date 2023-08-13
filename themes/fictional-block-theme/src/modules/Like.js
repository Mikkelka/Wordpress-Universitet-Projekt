
import axios from "axios"

class Like {
    // Constructor function
    constructor() {
        // Check if element with class "like-box" exists in the document
        if (document.querySelector(".like-box")) {
            // Set the "X-WP-Nonce" header in the axios default headers to the value of `universityData.nonce`
            axios.defaults.headers.common["X-WP-Nonce"] = universityData.nonce;
            // Call the events() method
            this.events();
        }
    }

    // Events method
    events() {
        // Add a click event listener to the element with class "like-box"
        document.querySelector(".like-box").addEventListener("click", e => this.ourClickDispatcher(e));
    }

    // OurClickDispatcher method
    ourClickDispatcher(e) {
        // Get the currentLikeBox element from the event target
        let currentLikeBox = e.target;
        // Find the nearest parent element with class "like-box"
        while (!currentLikeBox.classList.contains("like-box")) {
            currentLikeBox = currentLikeBox.parentElement;
        }

        // Check if the currentLikeBox has the attribute "data-exists" set to "yes"
        if (currentLikeBox.getAttribute("data-exists") == "yes") {
            // Call the deleteLike() method
            this.deleteLike(currentLikeBox);
        } else {
            // Call the createLike() method
            this.createLike(currentLikeBox);
        }
    }

    // CreateLike method
    async createLike(currentLikeBox) {
        try {
            // Send a POST request to the "manageLike" endpoint with the professorId attribute value of the currentLikeBox
            const response = await axios.post(universityData.root_url + "/wp-json/university/v1/manageLike", { "professorId": currentLikeBox.getAttribute("data-professor") });

            // Check if the response data is not equal to "Only logged in users can create a like."
            if (response.data != "Only logged in users can create a like.") {
                // Set the "data-exists" attribute of the currentLikeBox to "yes"
                currentLikeBox.setAttribute("data-exists", "yes");

                // Get the current like count from the currentLikeBox element and increment it by 1
                var likeCount = parseInt(currentLikeBox.querySelector(".like-count").innerHTML, 10);
                likeCount++;

                // Update the like count displayed in the currentLikeBox element
                currentLikeBox.querySelector(".like-count").innerHTML = likeCount;
                // Set the "data-like" attribute of the currentLikeBox to the response data
                currentLikeBox.setAttribute("data-like", response.data);
            }
            // Log the response data to the console
            console.log(response.data);
        } catch (e) {
            // Log "Sorry" to the console if an error occurs
            console.log("Sorry");
        }
    }

    // Refactored code to comply with line length limit and added comments for clarity

    async deleteLike(currentLikeBox) {
        try {
            // Send a DELETE request to the API endpoint to remove the like
            const response = await axios({
                url: universityData.root_url + "/wp-json/university/v1/manageLike",
                method: 'delete',
                data: { "like": currentLikeBox.getAttribute("data-like") },
            });

            // Update the data attribute to indicate that the like no longer exists
            currentLikeBox.setAttribute("data-exists", "no");

            // Get the current like count and decrement it by 1
            var likeCount = parseInt(currentLikeBox.querySelector(".like-count").innerHTML, 10);
            likeCount--;

            // Update the like count in the UI
            currentLikeBox.querySelector(".like-count").innerHTML = likeCount;

            // Reset the data-like attribute
            currentLikeBox.setAttribute("data-like", "");

            // Log the response data to the console
            console.log(response.data);

        } catch (e) {
            // Log any errors that occur during the request
            console.log(e);
        }
    }
}

export default Like




// old version

/*

class Like {
    constructor() {
        this.event();
    }

    event() {
        document.querySelector('.like-box').addEventListener('click', (e) => {
            this.ourClickDispatcher(e);
        });
    }

    // methods
    ourClickDispatcher(e) {
        console.log(e, "e");
        var currentLikeBox = e.target.closest('.like-box')

        // if dataattribute "data-exists" = yes 
        if (currentLikeBox.dataset.exists === 'yes') {
            this.deleteLike(currentLikeBox)
        } else {
            this.createLike(currentLikeBox)
        }
    }

    createLike(currentLikeBox) {

        const data = {
            professorId: currentLikeBox.dataset.professorId,
        }

        // send request to server to create like
        fetch(`${universityData.root_url}/wp-json/university/v1/manageLike`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': universityData.nonce
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                currentLikeBox.dataset.exists = 'yes'
                // find currentLikeBox .like-count number and add 1 to current like count
                currentLikeBox.querySelector('.like-count').textContent = parseInt(currentLikeBox.querySelector('.like-count').textContent) + 1
                // set data-like
                currentLikeBox.



            })
            .catch(error => console.error(error));
    }

    deleteLike() {

        const data = {
            like: currentLikeBox.dataset.like,
        }

        // send request to server to delete like
        fetch(`${universityData.root_url}/wp-json/university/v1/manageLike`, {
            method: 'DELETE',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': universityData.nonce
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
            .catch(error => console.error(error));
    }
}

export default Like

*/
