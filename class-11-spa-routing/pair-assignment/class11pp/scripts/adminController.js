(function(module) {
  var adminController = {};

  // DONE: Define a function that hides all main section elements, and then reveals just the #about section:
  adminController.index = function() {
    $('.tab-content').hide();
    $('#blog-stats').show();
    $('#blog-stats .articles').text(Article.all.length);
    $('#blog-stats .words').text(Article.numWordsAll());
  };

  module.adminController = adminController;
})(window);
