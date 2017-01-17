var request = require('request');

var GITHUB_USER = "MichaelMini";
var GITHUB_TOKEN = "c36ec186c9a3ad5104eb2dd2c83ba812b897bec9";

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  var requestOptions = {
  	url: requestURL,
  	headers: {
  		'user-agent': GITHUB_USER
  	}
  }
  var res = request.get(requestOptions, cb);
}

getRepoContributors('MichaelMini','github-avatar-downloader', function(err, result){
	var parseData = JSON.parse(result.body);

	console.log(parseData[0]['avatar_url']);

});