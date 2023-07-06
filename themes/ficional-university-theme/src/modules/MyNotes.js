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
        console.log(e);

        // Get the parent with class create-note
        const createNoteContainer = e.target.closest('.create-note');
        const myNotesContainer = document.querySelector('#my-notes');
        console.log(createNoteContainer);

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
            status: 'publish'
        }

        // Include the headers in the fetch request
        fetch(`${universityData.root_url}/wp-json/wp/v2/note/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(ourNewPost)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
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
