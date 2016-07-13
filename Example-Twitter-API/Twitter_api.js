// Visit https://www.npmjs.com/package/twitter to get additional information
var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: 'XXXX',
  consumer_secret: 'XXXX',
  access_token_key: 'XXXX',
  access_token_secret: 'XXXXX'
});
/* client.get('favorites/list', function(error, tweets, response){
  if(error) throw error;
  console.log(tweets);  // The favorites. 
  console.log(response);  // Raw response object. 
}); */

//Stream tweets with specific hashtag
/* var stream = client.stream('statuses/filter', {track: '#SAP'});
	stream.on('data', function(tweet) {
	console.log(tweet.text);
});
stream.on('error', function(error) {
  throw error;
}); */

// https://dev.twitter.com/rest/public
// Top Names or Hashtags id:1 = worldwide / id:656958 = Hamburg
// tweet_volume is the volume of the tweets per trend for the last 24 hours
 function getNamePair(tweets){
  for (var key in tweets.trends) {
    var name = tweets.trends[key].name;
    var volume = tweets.trends[key].tweet_volume;
		 console.log(key, "Name - " + name + ", tweet_vol - "  + volume);	 
	 }	 
 }
var params = {id: 1};
client.get('trends/place', params, function(error, tweets, response){
  if(error) throw error;
// Shows all Information regarding the hashtags
//  console.log(tweets[0]);
  getNamePair(tweets[0]);
 });
