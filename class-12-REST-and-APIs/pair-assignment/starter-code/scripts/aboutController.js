(function(module) {
  var aboutController = {};

  aboutController.index = function(view) {
    $('#about').show().siblings().hide();

    // DONE: Call a function to load (AKA 'request') our repo data.
    // Pass in a view function as a callback, so our repos will render after the data is loaded.
    $.ajax({
      url: 'https://api.guthub.com/users/katepaulino/repos' +
        '?per_page=5&sort=updated',
      headers: {'Authorization': 'token ' + githubToken}
      success: function (data) {
        view(data);
      }
    });
  };

  module.aboutController = aboutController;
})(window);
