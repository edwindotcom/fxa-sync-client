
git clone https://github.com/edmoz/fxa-sync-client.git
cd fxa-sync-client
npm install (sudo if it fails)
bin/sync-cli.js -e EMAIL -p PASSWORD -t bookmarks

Print Firefox Account Sync Data.
Usage: node ./bin/sync-cli.js

Options:
  --help, -h      display this usage message                                           
  --email, -e     account email                                                          [required]
  --password, -p  account password                                                       [required]
  --type, -t      sync data type: {bookmarks,history,passwords,tabs,addons,prefs,forms}  [default: "bookmarks"]
  --command, -c   action to perform {fetch|push}                                       
  --env           target environment: stage/prod or the name of an ephemeral             [default: "prod"]
