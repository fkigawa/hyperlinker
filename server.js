const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./db');

app.use(bodyParser.text({type: '*/*'}));
app.use(myMiddleware);

function myMiddleware(req, res, next) {
    req.rawBody = req.body;
    if(req.headers['content-type'] === 'application/json') {
        req.body = JSON.parse(req.body);
    }
    next();
}

const MongoClient = require('mongodb').MongoClient;
const port = 3000;


MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)
  const datab = database.db("hyperlinker")
  require('./app/routes')(app, datab);

  app.listen(port, () => {
    console.log('We are live on ' + port);
  });
})
