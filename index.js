// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var mongodb = 'mongodb://neostart:k5882@ds145295.mlab.com:45295/neostartserver';
//var mongodb = 'mongodb://smart:k12345@ds017173.mlab.com:17173/neostart';
var databaseUri = process.env.DATABASE_URI || process.env.MONGOLAB_URI || mongodb;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || mongodb,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || '6oNn8UQpvU8r4Jl3ABAvxLqlIQHlpiAiPr2gNvQZ',
  masterKey: process.env.MASTER_KEY || 'Sio1RdFtsXxa9Qm29kE7pNe0e4j92wZuEYANcTt4', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'https://neostartserver.herokuapp.com/parse',  // Don't forget to change to https if needed
  facebookAppIds : process.env.FACEBOOK_APP_ID || '913764205386593',
  restAPIKey : 'rbaNGUJJh9xAUfikGKJNoSik3MGhxaIcQqcXYHYz',
  clientKey : 'xEGyDaoAZEgFm7UNEzebx8YucSmHRvue1NoaTYNG',
  dotNetKey : 'I93cw1kNOgKfi1GFWFyNvckTq0dwsUrgyLX60IsI',
  javascriptKey : 'oW1NGaKxHYeZCzLpfB5oRgh16POR7RehfsnK4ipV',
  fileKey : '3daed3f9-02bf-4a47-a431-c9c4bda78ad2',
  oauth:
  {
    facebook:
    {
        appIds: "913764205386593"
    }
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a web site.');
});

var port = process.env.PORT || 1337;
app.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});
