var ObjectID = require('mongodb').ObjectID;
const axios = require('axios');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;


module.exports = function(app, db) {

  app.put('/names/:name', (req, res) => {
    const name = { name: req.params.name }
    const object = {
      name: req.params.name,
      url: req.body.url
    }

    db.collection('names').update(name, object, { upsert : true }, (err, result) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(name);
      }
    })
  })

  app.get('/names/:name', (req, res) => {
    const name = {
      name: req.params.name
    }

    db.collection('names').findOne(name, (err, result) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        if (result == null) {
          res.status(404)
             .send('Not found');
        } else {
          return res.send(JSON.stringify({
            'name': result.name,
            'url': result.url
          })+'\n');
        }
      }
    })
  })

  app.delete('/names', (req, res) => {
    db.collection('names').remove({}, (err, result) => {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send('names deleted');
      }
    })
  })

  app.post('/annotate', async (req, res) => {

    const input = req.body;
    var dom = new JSDOM('<div>' + input + '</div>');
    node = dom.window.document;

    async function hyperlink(textnode) {
      var words_hash = {};
      var string = textnode.textContent;
      var str = string.split(/[^A-Za-z0-9]/);

      for (let i = 0; i < str.length; i++) {
        await axios.get(`http://localhost:3000/names/${str[i]}`)
        .then(function (response) {
          var anchor = node.createElement('a');
          anchor.setAttribute('href', response.data.url);
          anchor.innerHTML = str[i];
          words_hash[str[i]] = anchor;
        })
        .catch(function (error) {
        })
      }

      for (var key in words_hash) {
        string = string.replace(key, words_hash[key].outerHTML);
      }

      var frag = JSDOM.fragment(string);
      var parent = textnode.parentNode;
      textnode.parentNode.replaceChild(frag, textnode);
      return;
    }


    async function traverse(node) {
      if (node) {

        if (node.tagName == 'A') {
          return;
        } else if (node.nodeType == '3') {
          await hyperlink(node);
          return;
        }

        for (let i = 0; i < node.childNodes.length; i++) {
          await traverse(node.childNodes[i]);
        }
      }
      return;
    }

    await traverse(node);
    res.send(node.querySelector('div').innerHTML);
  });
};
