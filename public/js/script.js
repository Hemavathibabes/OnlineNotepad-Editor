'use strict';
    
let lastRow = document.querySelector('table tbody tr:last-child td:nth-child(2)');
var lastRowId = lastRow ? parseInt(lastRow.innerText) : 0;

function searchNote(q) {
    if(!q) {
        AJAX.post('/load-more', {
            id: 0,
            limit: 20
        }).then(rows => {
            lastRowId = rows[rows.length - 1].id;

            let tbody = '';
            rows.forEach((row, ind) => {
                tbody += '<tr><td>' + (ind + 1) + '</td><td>' + row.id + '</td><td>' + row.filename + '</td><td>' + row.info + '</td></tr>';
            });

            document.querySelector('table tbody').innerHTML = tbody;
        });
    }
     else {
        AJAX.get('/search', {
            q: q
        }).then(res => {
            if(res.code == 1) {
                let tbody = '';
                res.rows.forEach((row, ind) => {
                    tbody += '<tr><td>' + (ind + 1) + '</td><td>' + row.id + '</td><td>' + row.filename + '</td><td>' + row.info + '</td></tr>';
                });

                document.querySelector('table tbody').innerHTML = tbody;
            }
        }).catch(err => console.log(err));
    }
}

function DeleteNote(id, el) {
     

    AJAX.post('/delete', {
        id: id
    }).then(res => {
        alert(res.message);
        if(res.code == 1) {
            el.parentElement.parentElement.remove();

            document.querySelectorAll('table tbody tr').forEach((row, ind) => {
                row.querySelector('td').innerHTML = (ind + 1);
            });
        }
    });
}
/*function saveNote(e) {
    e.preventDefault();
    
    if(window.location.pathname == '/') {
          AJAX.post('/add-new', {
            content_name: form.content_name.value,
            content: document.getElementById('content').innerHTML
        }).then(res => {
            console.log(res);
            if(res.code == 1) {
                window.location.href = '/edit/' + res.insertedID
            } else {
                alert(res.message);
            }
        });
       
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


 
}*/

function loaduserid2()
{
    var userData=JSON.parse(localStorage.getItem('userData') ||'{}');
            var userid=userData.userid;
            document.getElementById('u_id').value=userid;
}

function savelogin(e){
    e.preventDefault();
    let xhr= new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(this.status ==200 && this.readyState ==4){
            //alert(this.responseText);
        let data=JSON.parse(this.responseText);
           if(data.code==1)
           {
            alert("WELCOME....."   + data.username);
            localStorage.setItem('userData', JSON.stringify({
                userid: data.userid,
                username: data.username
            }));
            
             document.cookie = "userId=" + data.userid;
            window.location.href = '/';
    
           }
           else
           {
            alert(data.message);
           }
        }
    }
    xhr.onerror = function(){
        alert("error");
    }
     xhr.open('POST', '/auth-login',true);
     //xhr.open('GET','/saving',true);
     xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify({
        userid:document.login.userid.value,
       // username:document..username.value,
        password:document.login.password.value,

       
    }));
//   xhr.open('POST','/saving',true);
//   xhr.setRequestHeader("Content-Type",'text/ejs');
}

    
function savedata(e)
{
         e.preventDefault();
    let xhr= new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(this.status ==200 && this.readyState ==4){
            alert(this.responseText);
        }
    }
    xhr.onerror = function(){
        alert("error");
    }
     xhr.open('POST', '/save-userdata',true);
     xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify({
        userid:document.notepad.userid.value,
        username:document.notepad.username.value,
        password:document.notepad.password.value
    }));

}
