import axios from "axios"

class MyNotes {
    constructor() {
        // If the element with id "my-notes" exists on the page, 
        // set Axios default headers and bind the events
        if (document.querySelector("#my-notes")) {
            axios.defaults.headers.common["X-WP-Nonce"] = universityData.nonce
            this.myNotes = document.querySelector("#my-notes")
            this.events()
        }
    }

    // Bind event listeners for the buttons and list items
    events() {
        // Listen for click events on the "my-notes" list and delegate to the clickHandler
        this.myNotes.addEventListener("click", e => this.clickHandler(e));

        // Listen for click events on the "submit-note" button and create a new note on click
        document.querySelector(".submit-note").addEventListener("click", () => this.createNote());
    }

    // Handle click events on the "my-notes" list
    clickHandler(e) {
        // If a delete button was clicked, delete the note
        if (e.target.classList.contains("delete-note") || e.target.classList.contains("fa-trash-o")) {
            this.deleteNote(e);
        }

        // If an edit button was clicked, toggle the note's edit mode
        if (e.target.classList.contains("edit-note") || e.target.classList.contains("fa-pencil") || e.target.classList.contains("fa-times")) {
            this.editNote(e);
        }

        // If an update button was clicked, update the note
        if (e.target.classList.contains("update-note") || e.target.classList.contains("fa-arrow-right")) {
            this.updateNote(e);
        }
    }

    // Traverse up the DOM tree until a list item is found
    findNearestParentLi(el) {
        let thisNote = el
        while (thisNote.tagName != "LI") {
            thisNote = thisNote.parentElement
        }
        return thisNote
    }

    // Toggle the note's edit mode
    editNote(e) {
        const thisNote = this.findNearestParentLi(e.target)

        // If the note is currently editable, make it read-only, else make it editable
        if (thisNote.getAttribute("data-state") == "editable") {
            this.makeNoteReadOnly(thisNote)
        } else {
            this.makeNoteEditable(thisNote)
        }
    }

    // Make a note editable
    makeNoteEditable(thisNote) {
        // Update the note's edit button and input fields
        thisNote.querySelector(".edit-note").innerHTML = '<i class="fa fa-times" aria-hidden="true"></i> Cancel'
        thisNote.querySelector(".note-title-field").removeAttribute("readonly")
        thisNote.querySelector(".note-body-field").removeAttribute("readonly")
        thisNote.querySelector(".note-title-field").classList.add("note-active-field")
        thisNote.querySelector(".note-body-field").classList.add("note-active-field")
        thisNote.querySelector(".update-note").classList.add("update-note--visible")

        // Set the note's data state to "editable"
        thisNote.setAttribute("data-state", "editable")
    }

    // Make a note read-only
    makeNoteReadOnly(thisNote) {
        // Update the note's edit button and input fields
        thisNote.querySelector(".edit-note").innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i> Edit'
        thisNote.querySelector(".note-title-field").setAttribute("readonly", "true")
        thisNote.querySelector(".note-body-field").setAttribute("readonly", "true")
        thisNote.querySelector(".note-title-field").classList.remove("note-active-field")
        thisNote.querySelector(".note-body-field").classList.remove("note-active-field")
        thisNote.querySelector(".update-note").classList.remove("update-note--visible")

        // Set the note's data state to "cancel"
        thisNote.setAttribute("data-state", "cancel")
    }

    // Delete a note
    async deleteNote(e) {
        // Get the note to be deleted
        const thisNote = this.findNearestParentLi(e.target)

        try {
            // Send a DELETE request to the notes endpoint
            const response = await axios.delete(universityData.root_url + "/wp-json/wp/v2/note/" + thisNote.getAttribute("data-id"))

            // Animate the note's removal from the list
            thisNote.style.height = `${thisNote.offsetHeight}px`
            setTimeout(function () {
                thisNote.classList.add("fade-out")
            }, 20)
            setTimeout(function () {
                thisNote.remove()
            }, 401)

            // If the user's note count is less than 5, hide the note limit message
            if (response.data.userNoteCount < 5) {
                document.querySelector(".note-limit-message").classList.remove("active")
            }
        } catch (e) {
            console.log("Sorry")
        }
    }

    // Update a note
    async updateNote(e) {
        // Get the note to be updated
        const thisNote = this.findNearestParentLi(e.target)

        // Get the note's updated title and content
        var ourUpdatedPost = {
            "title": thisNote.querySelector(".note-title-field").value,
            "content": thisNote.querySelector(".note-body-field").value
        }

        try {
            // Send a POST request to the notes endpoint
            const response = await axios.post(universityData.root_url + "/wp-json/wp/v2/note/" + thisNote.getAttribute("data-id"), ourUpdatedPost)

            // Make the updated note read-only
            this.makeNoteReadOnly(thisNote)
        } catch (e) {
            console.log("Sorry")
        }
    }

    // Create a note
    async createNote() {
        // Get the new note's title and content
        var ourNewPost = {
            "title": document.querySelector(".new-note-title").value,
            "content": document.querySelector(".new-note-body").value,
            "status": "publish"
        }

        try {
            // Send a POST request to the notes endpoint
            const response = await axios.post(universityData.root_url + "/wp-json/wp/v2/note/", ourNewPost)

            // If the note was created successfully, reset the new note form and add the new note to the list
            if (response.data != "You have reached your note limit.") {
                // Clear the new note form
                document.querySelector(".new-note-title").value = ""
                document.querySelector(".new-note-body").value = ""

                // the new note to the top of the list with a "fade-in" animation
                document.querySelector("#my-notes").insertAdjacentHTML(
                    "afterbegin",
                    ` <li data-id="${response.data.id}" class="fade-in-calc">
                      <input readonly class="note-title-field" value="${response.data.title.raw}">
                      <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
                      <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
                      <textarea readonly class="note-body-field">${response.data.content.raw}</textarea>
                      <span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i> Save</span>
                    </li>`
                )

                // Temporarily make the new list item invisible so we can measure its height
                let finalHeight
                let newlyCreated = document.querySelector("#my-notes li")

                // Wait a bit for the browser to render the new list item, then calculate its height
                setTimeout(function () {
                    finalHeight = `${newlyCreated.offsetHeight}px`
                    newlyCreated.style.height = "0px"
                }, 30)

                // Remove the "fade-in" class and set the new list item's height to make it visible with a slide down animation
                setTimeout(function () {
                    newlyCreated.classList.remove("fade-in-calc")
                    newlyCreated.style.height = finalHeight
                }, 50)

                // Remove the inline height style after the animation is complete to make our design responsive again
                setTimeout(function () {
                    newlyCreated.style.removeProperty("height")
                }, 450)
            } else {
                // If the user has reached their note limit, show the limit message
                document.querySelector(".note-limit-message").classList.add("active")
            }
        } catch (e) {
            console.error(e)
        }
    }
}

export default MyNotes











/* 

class MyNotes {
    constructor() {
        this.events();
    }

    // function to attach event listeners
    events() {
        // Select the parent element
        const myNotesContainer = document.querySelector('#my-notes');
        const submitBtn = document.querySelector('.submit-note');

        // Attach event listeners
        myNotesContainer.addEventListener('click', e => {
            if (e.target.matches('.delete-note')) {
                this.deleteNote(e);
            } else if (e.target.matches('.edit-note')) {
                this.editNote.bind(this)(e);
            } else if (e.target.matches('.update-note')) {
                this.updateNote.bind(this)(e);
            }
        });

        submitBtn.addEventListener('click', this.submitNote.bind(this));
    }

    // function to delete a note 
    deleteNote(e) {
        // Get the parent list item
        const thisNote = e.target.closest('li');

        // Get the data-id attribute
        const noteId = thisNote.getAttribute('data-id');

        // Create a Headers object and append the 'X-WP-Nonce' header to it
        const headers = new Headers();
        headers.append('X-WP-Nonce', universityData.nonce);

        // Include the headers in the fetch request
        fetch(`${universityData.root_url}/wp-json/wp/v2/note/${noteId}`, {
            method: 'DELETE',
            headers: headers
        })
            .then(response => response.json())
            .then(data => {
                thisNote.remove();
                console.log(data)
            })
            .catch(error => console.log(error));
    }

    // function to update a note 
    updateNote(e) {
        // Get the parent list item
        const thisNote = e.target.closest('li');

        // Get the data-id attribute
        const noteId = thisNote.getAttribute('data-id');

        // Create a Headers object and append the 'X-WP-Nonce' header to it
        const headers = new Headers();
        headers.append('X-WP-Nonce', universityData.nonce);
        headers.append('Content-Type', 'application/json'); // Add this line

        // The data to update
        const ourUpdatePost = {
            'title': thisNote.querySelector('.note-title-field').value,
            'content': thisNote.querySelector('.note-body-field').value
        }

        // Include the headers in the fetch request
        fetch(`${universityData.root_url}/wp-json/wp/v2/note/${noteId}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(ourUpdatePost)
        })
            .then(response => response.json())
            .then(data => {
                // Find the edit button
                const editButton = thisNote.querySelector('.edit-note');
                this.makeNoteReadonly(thisNote, editButton);
            })
            .catch(error => console.log(error));
    }


    // function to edit a note
    editNote(e) {
        // Get the parent list item
        const thisNote = e.target.closest('li');

        // Get the data-id attribute
        const noteState = thisNote.getAttribute('data-state');

        // check if the note is editable
        if (noteState == "editable") {
            this.makeNoteReadonly(thisNote, e.target);
        } else {
            this.makeNoteEditable(thisNote, e.target);
        }
    }

    // function to make a note editable
    makeNoteEditable(thisNote, button) {
        button.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i> Cancel';
        thisNote.setAttribute('data-state', 'editable');

        const titleField = thisNote.querySelector('.note-title-field');
        const bodyField = thisNote.querySelector('.note-body-field');
        const updateNote = thisNote.querySelector('.update-note');

        titleField.removeAttribute('readonly');
        bodyField.removeAttribute('readonly');

        titleField.classList.add('note-active-field');
        bodyField.classList.add('note-active-field');

        updateNote.classList.add('update-note--visible');
    }

    // function to make a note readonly
    makeNoteReadonly(thisNote, button) {
        // this line should be added to the makeNoteReadonly function
        button.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i> Edit';

        thisNote.setAttribute('data-state', 'cancel');

        const titleField = thisNote.querySelector('.note-title-field');
        const bodyField = thisNote.querySelector('.note-body-field');
        const updateNote = thisNote.querySelector('.update-note');

        titleField.setAttribute('readonly', 'readonly');
        bodyField.setAttribute('readonly', 'readonly');

        titleField.classList.remove('note-active-field');
        bodyField.classList.remove('note-active-field');

        updateNote.classList.remove('update-note--visible');
    }


    // function to submit a note 
    submitNote(e) {


        // Get the parent with class create-note
        const createNoteContainer = e.target.closest('.create-note');
        const myNotesContainer = document.querySelector('#my-notes');


        // get value from new-note-title and new-note-body
        const newNoteTitle = createNoteContainer.querySelector('.new-note-title');
        const newNoteBody = createNoteContainer.querySelector('.new-note-body');

        // Create a Headers object and append the 'X-WP-Nonce' header to it
        const headers = new Headers();
        headers.append('X-WP-Nonce', universityData.nonce);
        headers.append('Content-Type', 'application/json'); // Add this line

        // The data to update
        const ourNewPost = {
            'title': newNoteTitle.value,
            'content': newNoteBody.value,
            status: 'publish',
        }

        // Include the headers in the fetch request
        fetch(`${universityData.root_url}/wp-json/wp/v2/note/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(ourNewPost)
        })
            .then(response => {
                console.log(response);
                return response.json();
            })
            .then(data => {
                console.log(data, 'data')
                // empty out the form
                newNoteTitle.value = '';
                newNoteBody.value = '';
                // add the new note to the list
                const newNote = document.createElement('li');
                newNote.setAttribute('data-id', data.id);
                newNote.innerHTML = `
                    <input readonly class="note-title-field" value="${data.title.raw}">
                    <span class="edit-note"> <i class="fa fa-pencil" aria-hidden="true"></i> Edit </span>
                    <span class="delete-note"> <i class="fa fa-trash-o" aria-hidden="true"></i> Delete </span>
                    <textarea readonly class="note-body-field">${data.content.raw}</textarea>
                    <span class="update-note btn btn--blue btn--small"> <i class="fa fa-arrow-right" aria-hidden="true"></i> Save </span>
                `;
                myNotesContainer.prepend(newNote);
            })
            .catch(error => console.log(error));
    }


}

export default MyNotes;
*/