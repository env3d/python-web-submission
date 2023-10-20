
(async function() {
  
  let pyodide = await loadPyodide();
  await pyodide.loadPackage('nltk');
  let resp = await fetch('/vader_lexicon.zip');
  let s_buffer = await resp.arrayBuffer();
  pyodide.FS.mkdirTree('/home/pyodide/nltk_data/sentiment/');  
  pyodide.FS.writeFile('/home/pyodide/nltk_data/sentiment/vader_lexicon.zip', new Uint8Array(s_buffer));
  pyodide.runPython(`
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk
from urllib.request import urlopen, Request
import json

#nltk.download('vader_lexicon')
sid = SentimentIntensityAnalyzer()

def get_sentiment(sentence):     
    return sid.polarity_scores(sentence)['compound']
`);  
  
  let get_sentiment = pyodide.globals.get('get_sentiment');  
  Sk.builtins.get_sentiment = function(sentence) {
    score = get_sentiment(sentence.v);
    return Sk.ffi.remapToPy(score);
  };
  
  let get_reddit_news = async function(url) {
    url = url || 'https://www.reddit.com/r/worldnews/.json';
    resp = await fetch(url);
    json = await resp.json();
    return json['data']['children'].map( node => node['data']['title'] );
  };

  window.get_reddit_news = get_reddit_news;
  Sk.builtins.get_reddit_news = new Sk.builtin.func(function (url) {
    return new Sk.misceval.promiseToSuspension(get_reddit_news().then((r) => Sk.ffi.remapToPy(r)));
  });
})();

