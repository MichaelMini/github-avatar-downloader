var request = require('request');
var fs = require('fs');
require('dotenv').config();
var GITHUB_USER = process.env.GITHUB_USER;
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;
var owner = process.argv[2];
var name = process.argv[3];
console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
	if ( !fs.existsSync('./.env') ) {
		fs.mkdirSync('./.env');
	}
	if ( !GITHUB_USER || !GITHUB_TOKEN ) {
		console.log('Github User and Token info is missing in .env file.');
		process.exit(1);
	}
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
	if (err) {
		throw err;  // TODO: stop using this immature nonsense
	}
	var parseData = JSON.parse(result.body);
	if (parseData.message !== undefined) {
		console.log("OH NO, GITHUB IS ANGRY!!!  They said: ", parseData.message);
		if ( parseData.message === 'Bad credentials') {
			console.log('Check .env for correct User and Token.')
		}
		if (parseData.documentation_url) {
			console.log("Github suggested this documentation:", parseData.documentation_url);
		}
		process.exit(1);  // non-zero exit code means "something went wrong"
		// throw JSON.stringify(parseData, null, 2);
	}
	parseData.forEach(function(current_value, idx, array) {
		var url = current_value.avatar_url;
		var filePath = './avatars/' + current_value.login + '.jpg';
		downloadImageByURL(url, filePath);
		// if (idx === array.length - 1){
		// 	var message = 'Download complete.';
		// 	console.log(message);
		// }
	});
}

if ( !owner || !name || !isNaN(owner) || !isNaN(name) ) {
	console.log('Please insert repoOwner and repoName while run again.')
} else {
	getRepoContributors(owner, name, avatarsUrl);
}