#!/usr/bin/env node

var dataTypes = ["bookmarks","history","passwords","tabs","addons","prefs","forms"];
var envTypes = ["prod", "stage"];
var FIREBASE_URL = "https://fxa-sync.firebaseio.com";

var prod = {
  syncAuthUrl: 'https://token.services.mozilla.com',
  fxaServerUrl: 'https://api.accounts.firefox.com/v1'
};
var stage = {
  syncAuthUrl: 'https://token.stage.mozaws.net',
  fxaServerUrl: 'https://api-accounts.stage.mozaws.net/v1',
  // certs last a year
  duration: 3600 * 24 * 365
};

var argv = require('optimist')
  .usage('Print Firefox Account Sync Data.\nUsage: $0')
  .alias('help', 'h')
  .describe('help', 'display this usage message')
  .alias('email', 'e')
  .describe('email', 'account email')
  .demand('email')
  .alias('password', 'p')
  .describe('password', 'account password')
  .demand('password')
  .alias('type', 't')
  .describe('type', 'sync data type: {' + dataTypes.toString() +'}')
  .default('type', 'bookmarks')
  .alias('command', 'c')
  .describe('command', 'action to perform {fetch|push}')
  .default("env", "prod")
  .describe('env', "target environment: stage/prod or the name of an ephemeral")
  .describe('perf', "send performance data to firebase")
  .describe('quiet', "hide sync data print");

var args = argv.argv;

if (args.h) {
  argv.showHelp();
  process.exit(0);
}
var options = prod;
if (args['env'] === "stage"){
  options = stage;
}
console.log("env:\n"+JSON.stringify(options));

var request = require('request');
var FxSync = require('fx-sync');

var sync = new FxSync({ email: args['email'], password: args['password'] }, options);

function sendPerfData(startTime, total_time){
  console.log('sync-cli-total: ' + total_time );
  var epoch = Math.round(startTime/1000);
  var perfDb = "test";
  if (args['perf'] !== true){
    perfDb = args['perf'];
  }
  var options = {
    uri: "https://fxa-sync.firebaseio.com/"+perfDb +"/"+ epoch +".json",
    method: 'PUT',
    json: {
      "totalTime": total_time
    }
  };

  request(
    options,
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    }
  );
}

function fetchData(type){
  var startTime = (new Date).getTime();
  sync.fetch(type)
          .then(function(data) {
            var totalTime = ((new Date).getTime() - startTime);
            if(!args['quiet']){
              console.log("::"+type+"::");
              console.log(JSON.stringify(data, null, 2));
            }
            if (args['perf']){
              sendPerfData(startTime, totalTime);
            }
          })
          .done();
}

fetchData(args['type']);
