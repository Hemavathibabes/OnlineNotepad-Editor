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
var db = new sqlite3.Database('./filedatabase.db');

/*
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
*/


app.get('/', (req, res) => {
	res.render('index');
});

//db.run("CREATE TABLE d3 (uniqueid INTEGER PRIMARY KEY,info TEXT,filename TEXT)");
app.post('/save-content', (req, res) => {
	let data = req.body;

	db.serialize(function() {
		var stmt=db.prepare("INSERT INTO d3 VALUES (?,?,?)");
		stmt.run(data.content_id, data.content, data.content_name);
		stmt.finalize();
		res.end("data saved successfully");
	});
});


app.get('/search', (req, res) => {
	key = req.query.q;
	let query = `SELECT * from d3 WHERE uniqueid = ${key} OR filename = ${key}`;

	db.all(query, (err, rows) => {
		if(!err) {
			if(rows.length) {
				res.json(Object.assign({
					code: 1
				}, rows[0]));
			} else {
				res.json({
					code: 0,
					error: 'no data found with given name.'
				});
			}
		} else {
			console.log(err);
			res.json({
				error: 'no data found with given name.'
			});
		}
	});
});

const server = http.createServer(app).listen(process.env.PORT || 4000, (err) => {
    if (err) {
		console.log(err);
  	} else {
		const addr = server.address();
		console.log(`Server listening on %s:%s`, addr.address, addr.port);
	}
});


module.exports = app;