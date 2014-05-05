#!/usr/bin/env node

var dataTypes = ["bookmarks","history","passwords","tabs","addons","prefs","forms"];
var envTypes = ["prod", "stage"];

var argv = require('optimist')
  .usage('Run automation tests.\nUsage: $0')
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
  .default("env", "stage")
  .describe('env', "target environment: stage/prod or the name of an ephemeral");

var args = argv.argv;

if (args.h) {
  argv.showHelp();
  process.exit(0);
}

var FxSync = require('fx-sync');

var sync = new FxSync({ email: args['email'], password: args['password'] });

function fetchData(type){
  sync.fetch(type)
          .then(function(data) {
            console.log("::"+type+"::");
            console.log(JSON.stringify(data, null, 2));
          })
          .done();
}

fetchData(args['type']);
