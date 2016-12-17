//require npm packages
var request = require('request');
var Twitter = require('twitter');
var spotify = require('spotify');
var keys = require('./keys.js');
var fs = require('fs');

//set your arguments
var inputString = process.argv;
var action = inputString[2];
var name = inputString[3];

//Load your most recent 20 tweets
if (action === "my-tweets") {

    //link to your twitter keys
    var client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });

    //set the paramaters to load your timeline and limit to 20
    var params = { cassiepericak: 'nodejs', count: 20 };

    //get the your timelime using the params variable and run the function with the arguments for errors, tweets, and response
    client.get('statuses/user_timeline', params, function(error, tweets, response) {

        //if there isn't an error, log the tweets
        if (!error) {
            var allTweets = "";
            for (var i = 0; i < tweets.length; i++) {
                var tweetsData = tweets[i].text;
                allTweets += tweetsData;
                console.log(tweetsData);
            }
            //append the text file data
            fs.appendFile("random.txt", allTweets, "utf8", function(error) {

                //if there is an error, log the error
                if (error) {
                    console.log(error);
                }
            });

        } //otherwise, log the error
        else {
            console.log(error);
        }
    });

} //if the user enters in the spotify-this-song action
else if (action === "spotify-this-song") {

    //query spotify for the variable name or "The Sign" in there is no 3rd argument, and run the callback function
    spotify.search({ type: 'track', query: name || "The Sign" }, function(err, data) {

        //if there is an error, log it
        if (err) {
            console.log('Error occurred: ' + err);

            //exit the function
            return;

            //otherwise log the necessary information for the song "The Sign"
        } else {
            var songs = data.tracks.items;
            var allSongs = "";
            for (var i = 0; i < songs.length; i++) {
                var songData = songs[i];
                var songInfo = songData.artists[0].name + "\n" + songData.name + "\n" + songData.preview_url + "\n" + songData.album.name;
                allSongs += songInfo;
                console.log(songInfo);
            }
            fs.appendFile("random.txt", allSongs, "utf8", function(error) {

                //if there is an error, log the error
                if (error) {
                    console.log(error);
                }
            });
        }
    });
}
//Search for this movie name
else if (action === "movie-this") {

    //use request to query the omdb api and search by the name variable or if there is no 3rd argument, search for Mr. Nobody and return the data as a json object
    request("http://www.omdbapi.com/?t=" + name || "Mr. + Nobody" + "&y=&plot=short&r=json", function(error, response, body) {

        var movies = body;
        var allMovies = "";

        //if there isn't any error and the response status code is in the 200s, log the data
        if (!error && response.statusCode == 200) {
            for (var i = 0; i < movies.length; i++) {
                var movieData = movies[i];
                var movieInfo = JSON.parse(body);
                allMovies += movieInfo;
                console.log(movieInfo);
            }
        }
        //append the text file with the data
        fs.appendFile("random.txt", allMovies, "utf8", function(error) {

            //if there is an error, log the error
            if (error) {
                console.log(error);
            }
        });
    });

}
//if the action is "do-what-it-says"
else if (action === "do-what-it-says") {

    //use fs to read the text file
    fs.readFile('./random.txt', 'utf8', function(err, data) {

        //if there is an error
        if (err) {

            //exit the function and log the error
            return console.log(err);
        }
        //log the data
        console.log(data);
    });
}
