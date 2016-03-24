(function(module) {
  var articlesController = {};

  Article.createTable();  // Ensure the database table is properly initialized

  articlesController.index = function(ctx, next) {
    articleView.index(ctx.articles);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  //
  articlesController.loadById = function(ctx, next) { // loadById method on the articlesController object, assigning to the fucntion with the parameters ctx object and next callback
    var articleData = function(article) { // declare the articleData var assigning to function with the article callback,
      ctx.articles = article; // reassign the articles property to the context object to article
      next(); // call the next callback, in the execution path this function will fire when page.js calls for the url /article/:id
    };

    Article.findWhere('id', ctx.params.id, articleData); // once the callback returns the context id, the findwhere method will execute as a callback to the webDB.execute to select all from articles where field = id
  };

  // COMMENT: What does this method do?  What is it's execution path?

  articlesController.loadByAuthor = function(ctx, next) //loadByAuthormethod on articlesController object assigned to function with ctx and next params
    var authorData = function(articlesByAuthor) { //delcared authorData set to function(articlesByAuthor)
      ctx.articles = articlesByAuthor; //articles property of ctx object set to articlesByAuthor
      next(); //callback in the path this function will fire when page.js calls for the url author/:authorName
    };

    Article.findWhere('author', ctx.params.authorName.replace('+', ' '), authorData); //call back returns the context id, findWhere method that we defined will execute as a callback to the webDB to select all from articles where field = id
  };

  // COMMENT: What does this method do?  What is it's execution path?
  articlesController.loadByCategory = function(ctx, next) { // the loadByCategory method on articlesController object assigned to the function with parameters of ctx and next
    var categoryData = function(articlesInCategory) { // delcare the categoryData variable and assigning to the function articlesInCategory
      ctx.articles = articlesInCategory; //setting the articles property on the context object to articlesInCategory
      next(); //callback function to fire when page.js locates /category/:categoryName
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  articlesController.loadAll = function(ctx, next) { //the loadAll method on articlesController object assigned to the function with parameters of ctx and next
    var articleData = function(allArticles) { //delcare the articleData variable and assigning to the function allArticles
      ctx.articles = Article.all; //setting the articles property on the context object to Article.all
      next(); //callback function to fire when page.js routes to the main page
    };

    if (Article.all.length) {
      ctx.articles = Article.all;
      next();
    } else {
      Article.fetchAll(articleData);
    }
  };


  module.articlesController = articlesController;
})(window);
