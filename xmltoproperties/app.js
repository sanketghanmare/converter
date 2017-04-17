
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
var formidable = require('formidable');
var fs = require('fs');

// all environments
app.set('port', process.env.PORT || 3000);
//app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public/html'));
app.use(express.favicon());
app.use(express.logger('dev'));
//app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.post('/upload', function(req, res){

	  // create an incoming form object
	  var form = new formidable.IncomingForm();

	  // specify that we want to allow the user to upload multiple files in a single request
	  form.multiples = true;

	  // store all uploads in the /uploads directory
	  form.uploadDir = path.join(__dirname, '/uploads');

	  // every time a file has been uploaded successfully,
	  // rename it to it's orignal name
	  form.on('file', function(field, file) {
	    fs.rename(file.path, path.join(form.uploadDir, file.name));
	  });

	  // log any errors that occur
	  form.on('error', function(err) {
	    console.log('An error has occured: \n' + err);
	  });

	  // once all the files have been uploaded, send a response to the client
	  form.on('end', function() {
	    res.end('success');
	  });

	  // parse the incoming request containing the form data
	  form.parse(req);

	});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
