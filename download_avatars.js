var request = require('request');
var fs = require('fs');
var GITHUB_USER = "MichaelMini";
var GITHUB_TOKEN = "c36ec186c9a3ad5104eb2dd2c83ba812b897bec9";
var owner = process.argv[2];
var name = process.argv[3];
console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  var requestOptions = {
  	url: requestURL,
  	headers: {
  		'user-agent': 'GitHub Avatar Downloader - Student Project'
  	}
  }
  request.get(requestOptions, cb);
}

function downloadImageByURL (url, filePath){
	if (!fs.existsSync('./avatars')) {
		fs.mkdirSync('./avatars');
	}
	request.get(url)
	       .on('error', function (err) {
	         throw err;
	       })
	       .on('response', function (response) {
	         console.log('Response Status Message: ', response.statusMessage);
	         console.log('Response Content Type: ', response.headers['content-type']);
	       })
	       .pipe(fs.createWriteStream(filePath))

	       // .on('finish', function () {
	       // 	console.log('Download complete.')
	       // })
}

function avatarsUrl(err, result){
	var parseData = JSON.parse(result.body);
			parseData.forEach(function(current_value, idx, array) {
				var url = current_value.avatar_url;
				var filePath = './avatars/' + current_value.login + '.jpg';
				downloadImageByURL(url, filePath);
				// if (idx === array.length - 1){
		  //      var message = 'Download complete.';
		  //      console.log(message);
		  // 	}
			});
}

getRepoContributors(owner, name, avatarsUrl);