(function(module) {

  var articleView = {};

  var render = function(article) {
    var template = Handlebars.compile($('#article-template').text());

    article.daysAgo = parseInt((new Date() - new Date(article.publishedOn))/60/60/24/1000);
    article.publishStatus = article.publishedOn ? 'published ' + article.daysAgo + ' days ago' : '(draft)';
    article.body = marked(article.body);

    return template(article);
  };

  // COMMENT: What does this method do?  What is it's execution path?
  articleView.populateFilters = function() { // We have the populateFilters method on the articleView object and we're setting it to this function
    var options, // declaring the variable options and template, and setting it to the compile method on the Handlebars object, which is selecting the option-template ID and running the .text method to update the HTML
      template = Handlebars.compile($('#option-template').text());

    // Example of using model method with FP, synchronous approach:
    // NB: This method is dependant on info being in the DOM. Only authors of shown articles are loaded.
    options = Article.allAuthors().map(function(author) { return template({val: author}); });
    if ($('#author-filter option').length < 2) { // Prevent duplication
      $('#author-filter').append(options);
    };

    // Example of using model method with async, SQL-based approach:
    // This approach is DOM-independent, since it reads from the DB directly.
    Article.allCategories(function(rows) {
      if ($('#category-filter option').length < 2) {
        $('#category-filter').append(
          rows.map(function(row) {
            return template({val: row.category});
          })
        );
      };
    });
  };

  // COMMENT: What does this method do?  What is it's execution path?
  articleView.handleFilters = function() { // applying the handleFilters method on the articleView object, setting it to this function
    $('#filters').one('change', 'select', function() { // select the filters ID and apply the .one method (which runs the function once), so on change, the objects are selected
      resource = this.id.replace('-filter', ''); // the variable resource is being set to create a new string once the specific ID is located (ask????)
      page('/' + resource + '/' + $(this).val().replace(/\W+/g, '+')); // Replace any/all whitespace with a +
    });
  };
  // articleView.handleAuthorFilter = function() {
  //   $('#author-filter').on('change', function() {
  //     if ($(this).val()) {
  //       $('article').hide();
  //       $('article[data-author="' + $(this).val() + '"]').fadeIn();
  //     } else {
  //       $('article').fadeIn();
  //       $('article.template').hide();
  //     }
  //     $('#category-filter').val('');
  //   });
  // };
  //
  // articleView.handleCategoryFilter = function() {
  //   $('#category-filter').on('change', function() {
  //     if ($(this).val()) {
  //       $('article').hide();
  //       $('article[data-category="' + $(this).val() + '"]').fadeIn();
  //     } else {
  //       $('article').fadeIn();
  //       $('article.template').hide();
  //     }
  //     $('#author-filter').val('');
  //   });
  // };

  // DONE: Remove the setTeasers method, and replace with a plain ole link in the article template.
  // articleView.setTeasers = function() {
  //   $('.article-body *:nth-of-type(n+2)').hide();
  //
  //   $('#articles').on('click', 'a.read-on', function(e) {
  //     e.preventDefault();
  //     $(this).parent().find('*').fadeIn();
  //     $(this).hide();
  //   });
  // };

  articleView.initNewArticlePage = function() {
    $('#articles').show().siblings().hide();

    $('#export-field').hide();
    $('#article-json').on('focus', function(){
      this.select();
    });

    $('#new-form').on('change', 'input, textarea', articleView.create);
  };

  articleView.create = function() {
    var article;
    $('#articles').empty();

    // Instantiate an article based on what's in the form fields:
    article = new Article({
      title: $('#article-title').val(),
      author: $('#article-author').val(),
      authorUrl: $('#article-author-url').val(),
      category: $('#article-category').val(),
      body: $('#article-body').val(),
      publishedOn: $('#article-published:checked').length ? util.today() : null
    });

    $('#articles').append(render(article));

    $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });

    // Export the new article as JSON, so it's ready to copy/paste into blogArticles.js:
    $('#export-field').show();
    $('#article-json').val(JSON.stringify(article) + ',');
  };

  // COMMENT: What does this method do?  What is it's execution path?
  articleView.index = function(articles) { // index method on articleView objected assigned to function(articles)
    $('#articles').show().siblings().hide(); //jQuery selects the id articles we chain .show.siblings.hide which will hide content

    $('#articles article').remove(); //select article tag child of articles and take it out of the DOM
    articles.forEach(function(a) { // for each element in the articles array of objects, we append the data in the array to the articles ID in the DOM tree
      $('#articles').append(render(a)); //we put it back into the DOM
    });

    articleView.populateFilters();  // Here we just call our populateFilters method on the articleView object in our articleView.js file
    // COMMENT: What does this method do?  What is it's execution path?
    articleView.handleFilters();  // Here we just call our handleFilters method on the articleView object in our articleView.js file

    // DONE: Replace setTeasers with just the truncation logic, if needed:
    if ($('#articles article').length > 1) {
      $('.article-body *:nth-of-type(n+2)').hide();
    }
  };

  articleView.initAdminPage = function() {
    var template = Handlebars.compile($('#author-template').text());

    Article.numWordsByAuthor().forEach(function(stat) {
      $('.author-stats').append(template(stat));
    });

    $('#blog-stats .articles').text(Article.all.length);
    $('#blog-stats .words').text(Article.numWordsAll());
  };

  module.articleView = articleView;
})(window);
