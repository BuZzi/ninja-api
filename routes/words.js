var WordCounter = require('../lib/wordcounter.js');

exports.top = function(req, res) {
  res.json({
    "ninja": {
      "occurrences": 125,
      "rank": 1
    },
    "saucisse": {
      "occurrences": 76,
      "rank": 2
    }
  });
};

exports.list = function(req, res) {
  res.json({
    "caca": {
      "occurrences": 2,
      "rank": 75
    },
    "cacahuete": {
      "occurrences": 31,
      "rank": 24
    },
    "cacao": {
      "occurrences": 12,
      "rank": 51
    }
  });
};

exports.detail = function(req, res, next) {
  var word = req.params.word;
  var wordCounter = new WordCounter(word);
  var etherpad = req.app.get('etherpad');

  etherpad.listAllPads(function(err, data) {
    if (err) return next(err.message);
    var padIDs = data.padIDs || [];
    // synchronization step when word counts is done on all pads
    var count = 0;
    function callback() {
      count++;
      if (count == padIDs.length) {
        var data = {};
        data[word] = { occurrences: wordCounter.getOccurrences() };
        res.send(data);
      }
    }
    // loop over pads to compute word counts
    padIDs.forEach(function(padID) {
      etherpad.getText({ padID: padID }, function(err, data) {
        if (err) return next(err.message);
        wordCounter.addText(data.text);
        callback();
      });
    });
  });
};




