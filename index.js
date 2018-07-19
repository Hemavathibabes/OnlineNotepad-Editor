var http = require('http');

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({	
	extended: true
}));

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./sqlite-db-file.db');
global.db=db;

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

var fns=require('./functions');
//db.run("CREATE TABLE d7 (id INTEGER PRIMARY KEY AUTOINCREMENT,userid INTEGER ,info  TEXT,filename TEXT)");
// db.run("CREATE TABLE d5 (userid INTEGER PRIMARY KEY,username TEXT,password TEXT)");

app.get('/', (req, res) => {
	res.render('index', {
		edit:false,
		id:"",
         userid:"",
		filename:"",
		content:""
	});
});
app.get('/blank-editor', (req, res) => {
	res.render('index', {
		edit: false,
		filename: '',
		content: ''
	});
});


app.get('/load',(req,res)=>{
	if('cookie' in req.headers)
	{
			var userId = parseInt(req.headers.cookie.split('=')[1]);

	fns.LoadQuery('d7',userId, 0,20).then(rows => {
	res.render('index1',{
		rows:rows
	});
   });
  } 
   else
   {  
   	   
   		res.render('index1', {
   			rows:[]
   		});
      	

   } 
});

app.get('/login',(req,res) => {
	res.render('login');

});

app.get('/signup',(req,res) => {
	res.render('signup');
});


app.get('/edit/:id', (req, res) => {
	fns.find('d7', parseInt(req.params.id)).then(row => {
		res.render('index', {
			edit: true,
			id: row.id,
			userid:row.userid,
			filename: row.filename,
			content: row.info
		});
	});
});
app.post('/update', (req, res) => {
	let data = req.body;

	fns.update('d7', data.id, data.content_name, data.content).then(result => {
		res.json(result);
	}).catch(err => {
		res.json({
			code: 0,
			message: "Failed to update."
		});
	});
});



app.post('/load-more', (req, res) => {
	let data = req.body;

	fns.LoadQuery('d7', data.id, 20).then(rows => {
		res.json(rows);
	}).catch(err => {
		res.json({
			message: err
		});
	})
});

app.post('/delete',(req,res) => {
	let data =req.body;
	fns.remove('d7',data.id).then(result => {
		res.json(result);
	}).catch(err => {
		res.json({
			code:0,
			message: "Failed to delete."
		});
	})
});

app.post('/save-content', (req, res) => {
	let data = req.body;

	db.serialize(function() {
         if(!data.content_id)
		{
		res.end("Must fill the id");
	     }
	     else
	     {
	     var stmt=db.prepare("INSERT INTO d7 VALUES (?,?,?,?)");
		stmt.run(data.content_id,data.user_id, data.content,data.content_name);
		stmt.finalize();
		
	     	res.end("data saved");
	     }
	     
	});
});
app.post('/add-new', (req, res) => {
	let data = req.body;

	fns.insert('d7',data.content_id,data.content, data.content_name).then(result => {
		res.json({
			code: 1,
			//insertedID: result.id
			message:"inserted sucessfully."
		});
	}).catch(err => {
		res.json({
			code: 0,
			message: "Failed to insert."
		});
	});
});

app.post('/auth-login', (req,res) => {
	 let data=req.body;
	 fns.login('d5', data.userid, data.password).then(docs => {
		 if(docs.length) {
			// Set cookie
			res.json({
				code: 1,
				message: "login success.",
				userid: docs[0].userid,
				username: docs[0].username
			});
		 } else {
			 res.json({
				code: 0,
				message: "userid and password and does not match."
			});
		 }
	 }).catch(err => {
		 console.log(err);
		 res.json({
			 code: 0,
			 message: "Failed to check login. Something went wrong."
		 });
	 });
});

app.post('/save-userdata',(req,res) => {
	let data=req.body;
	db.serialize(function(){
		var stmt=db.prepare(`INSERT INTO d5 VALUES (?,?,?)`);
		stmt.run(data.userid,data.username,data.password);
		stmt.finalize();
		res.end("user data is saved  in the database");
	
	});
});
app.get('/search', (req, res) => {
  key=req.query.q;
	fns.search('d7', key).then(result => {
		res.json(result);
	
	}).catch(err => {
		res.json(err);
	});
});


const server = http.createServer(app).listen(process.env.PORT || '4000', (err) => {
    if (err) {
		console.log(err);
  	} else {
		const addr = server.address();
		console.log(`Server listening on %s:%s`, addr.address, addr.port);
	}
});



module.exports = app;