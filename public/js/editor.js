

function saveNote(e) {
    e.preventDefault();
    
    if(window.location.pathname == '/') {
    
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
    } else {
        AJAX.post('/update', {
            id: parseInt(window.location.pathname.split('/')[2]),
            content_name: form.content_name.value,
            content: document.getElementById('content').innerHTML
        }).then(res => {
            alert(res.message);
        }).catch(err => {
            alert('Something went wrong. Failed to update data.');
        });
    }
}
