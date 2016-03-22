(function(module) {
  var repos = {};

  repos.all = [];

  repos.requestRepos = function(view) {
    // DONE: How would you like to fetch your repos? Don't forget to call the callback.
    $.ajax({
      url: 'https://api.guthub.com/users/katepaulino/repos' +
        '?per_page=5&sort=updated',
      headers: {'Authorization': 'token ' + githubToken}
      success: function (data) {
        repos.all.push(data);
        view(data);
      }
    });
  };

  // DONE: Model method that filters the full collection for repos with a particular attribute.
  // You could use this to filter all repos that have a non-zero `forks_count`, `stargazers_count`, or `watchers_count`.
  repos.with = function(attr) {
    return repos.all.filter(function(repo) {
      return repo[attr];
    });
  };

  module.repos = repos;
})(window);
