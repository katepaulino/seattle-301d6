// DONE: Wrap the entire contents of this file in an IIFE.
// Pass in to the IIFE a module, upon which objects can be attached for later access.
(function(module) {

function Article (opts) {
  this.author = opts.author;
  this.authorUrl = opts.authorUrl;
  this.title = opts.title;
  this.category = opts.category;
  this.body = opts.body;
  this.publishedOn = opts.publishedOn;
}

Article.all = [];

Article.prototype.toHtml = function() {
  var template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
  this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

Article.loadAll = function(rawData) {
  rawData.sort(function(a,b) {
    return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  });

  // DONE: Refactor this forEach code, by using a `.map` call instead, since what we are
  // trying to accomplish is the transformation of one colleciton into another.

  // rawData.forEach(function(ele) {
  //   Article.all.push(new Article(ele));
  // })
  Article.all = rawData.map(function(ele) {
    return new Article(ele);
  });
};

// This function will retrieve the data from either a local or remote source,
// and process it, then hand off control to the View.

// DONE: Refactor this function, and provide it with a parameter of a callback function
//(for now just a placeholder, but to be referenced at call time as a view function)
// to execute once the loading of articles is done. We do this because we might want
// to call other view functions, and not just the initIndexPage() that we are replacing.
// Now, instead of calling articleView.initIndexPage(), we can simply run our callback.

Article.fetchAll = function(next) {
  if (localStorage.rawData) {
    Article.loadAll(JSON.parse(localStorage.rawData));
    next();
  } else {
    $.getJSON('/data/hackerIpsum.json', function(rawData) {
      Article.loadAll(rawData);
      localStorage.rawData = JSON.stringify(rawData); // Cache the json, so we don't need to request it next time.
      next();
    });
  }
};

// DONE: Chain together a `map` and a `reduce` call to get a rough count of all words in all articles.
Article.numWordsAll = function() {
  return Article.all.map(function(article) {
    return article.body.match(/\b\w+/g).length;
  })
    .reduce(function(a, b) {
      return a + b;
    })
  };
// DONE: Chain together a `map` and a `reduce` call to produce an array of unique author names.
Article.allAuthors = function() {
  return Article.all.map(function(article) {
    return article.author;
    })
    .reduce (function(names, name) {
      if (names.indexof(name) === -1) {
        names.push(name);
      }
      return names;
    }, []);
  };

Article.numWordsByAuthor = function() {
  // DONE: Transform each author string into an object with 2 properties: One for
  // the author's name, and one for the total number of words across the matching articles
  // written by the specified author.
  return Article.allAuthors().map(function(author) {
      return {
          name: author,
          numWords: Article.all.filter(function(a){
            return a.author === author;
          })
          .map(function(a) {
            return a.body.match(/\b\w+/g).length;
          })
          .reduce(function(a, b) {
           return a + b;
          })
      }
    })
  };

  Article.stats = function() {
    return {
      numArticles: Article.all.length,
      numWords: Article.numWordsAll(),
      Authors: Article.allAuthors,
    }
  };

  module.Article = Article;
})(window);
