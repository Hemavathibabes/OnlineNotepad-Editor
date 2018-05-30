'use strict';

function searchNote() {
//    e.preventDefault();
    
    let q = form.search.value;
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(this.status == 200 && this.readyState == 4) {
            // success
            let data = JSON.parse(this.responseText);

            if(data.code == 1) {
                let loadContent = confirm('Data found with given data. Would you like to load?', 'Yes', 'No');

                if(loadContent) {
                    form.content_id.value = data.uniqueid;
                    form.content_name.value = data.filename;
                    document.getElementById('content').innerHTML = data.info;
                }
            }
        }
    }

    xhr.onerror = function() {
        console.log('Error in ajax.');
    }

    xhr.open('GET', '/search?q=' + q, true);

    xhr.send();
}


function saveNote(e) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if(this.status == 200 && this.readyState == 4) {
            // success
            alert(this.responseText);
        }
    }

    xhr.onerror = function() {
        alert('Something went wrong. Failed to save data.');
    }

    xhr.open('POST', '/save-content', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        content_id: form.content_id.value,
        content_name: form.content_name.value,
        content: document.getElementById('content').innerHTML
    }));
}