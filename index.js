const path = require('path');
const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const conn = require('./lib/db');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/assets', express.static(__dirname + '/public'));

app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({
	extname: 'hbs',
	defaultLayout: 'base',
	layoutsDir: __dirname + '/views',
	partialsDir: __dirname + '/views/partials'
}));

app.get('/',(req, res) => {
	let sql = "SELECT * FROM logs";
	let query = conn.query(sql, (err, results) => {
	  if(err) throw err;
	  res.render('base',{
		results: results
	  });
	});
});

app.post('/save',(req, res) => {
	let data = {user_id: req.body.user_id, username: req.body.username, staff_name: req.body.staff_name, section: req.body.section, activity: req.body.activity};
	let sql = "INSERT INTO logs SET ?";
	let query = conn.query(sql, data, (err, results) => {
		if(err) throw err;
		res.redirect('/');
	});
});

app.post('/update',(req, res) => {
	let sql = "UPDATE logs SET user_id = '"+req.body.user_id+"', username = '"+req.body.username+"', staff_name = '"+req.body.staff_name+"', section = '"+req.body.section+"', activity = '"+req.body.activity+"' WHERE id = "+req.body.id;
	let query = conn.query(sql, (err, results) => {
		if(err) throw err;
		res.redirect('/');
	});
});

app.post('/delete',(req, res) => {
	let sql = "DELETE FROM logs WHERE id = "+req.body.id;
	let query = conn.query(sql, (err, results) => {
		if(err) throw err;
		res.redirect('/');
	});
});



app.get('/api/items',(req, res) => {
	let sqlQuery = "SELECT * FROM logs";
	let query = conn.query(sqlQuery, (err, results) => {
		if(err) throw err;
		res.send(apiResponse(results));
	});
});

app.get('api/items/:id', (req, res) => {
	let sqlQuery = "SELECT * FROM logs WHERE id = " + req.params.id;
	let query = conn.query(sqlQuery, (err, results) => {
		if(err) throw err;
		res.send(apiResponse(results));
	});
});

app.post('api/items',(req, res) => {
	let data = {title: req.body.title, body: req.body.body};
	let sqlQuery = "INSERT INTO logs SET ?";
	let query = conn.query(sqlQuery, data, (err, results) => {
		if(err) throw err;
		res.send(apiResponse(results));
	});
});

app.put('api/items/:id', (req, res) => {
	let sqlQuery = "UPDATE logs SET activity = '"+req.body.activity+"', WHERE id = "+req.params.id;
	let query = conn.query(sqlQuery, (err, results) => {
		if(err) throw err;
		res.send(apiResponse(results));
	});
});

app.delete('/api/items/:id', (req, res) => {
	let sqlQuery = "DELETE FROM logs WHERE id = "+req.params.id;
	let query = conn.query(sqlQuery, (err, results) => {
		if(err) throw err;
		res.send(apiResponse(results));
	});
});

function apiResponse(results){
	return JSON.stringify({"status": 200, "error": null, "response": results});
}

app.listen(3000,() =>{
	console.log('Listening on port 3000.');
});