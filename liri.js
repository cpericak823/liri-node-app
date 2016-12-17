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


//set all your functions as an object
var actionObjects = {
    "my-tweets": function(action) {
        //Load your most recent 20 tweets


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

            //if there isn't an error,
            if (!error) {
                var allTweets = "";
                for (var i = 0; i < tweets.length; i++) {
                    var tweetsData = tweets[i].text;
                    allTweets += tweetsData;
                    console.log(tweetsData);
                }

                //append the text file data
                fs.appendFile("log.txt", allTweets, "utf8", function(error) {

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

    },
    "spotify-this-song": function(name) {


        //query spotify for the variable name or "The Sign" in there is no 3rd argument, and run the callback function
        spotify.search({ type: 'track', query: name || "The Sign" }, function(err, data) {

            //if there is an error, log it
            if (err) {
                console.log('Error occurred: ' + err);

                //exit the function
                return;
            } else {
                //set the songs variable equal to the spotify object 
                var songs = data.tracks.items;

                //set all songs equal to an empty string
                var allSongs = "";

                //loop through the songs variable
                for (var i = 0; i < songs.length; i++) {

                    //set song data equal to index of songs
                    var songData = songs[i];

                    //set song info equal to the necessary information you need
                    var songInfo = "Artist Name: " + songData.artists[0].name + "\n" + "Song Name: " + songData.name + "\n" + "Preview URL: " + songData.preview_url + "\n" + "Album Name: " + songData.album.name;

                    //set all songs equal to song info
                    allSongs += songInfo;

                    //log the song Infor
                    console.log(allSongs);
                }

                //append the text file to log all the songs in the object
                fs.appendFile("./log.txt", allSongs + "\n", "utf8", function(error) {

                    //if there is an error, log the error
                    if (error) {
                        console.log(error);
                    }
                });
            }
        });

    },
    "movie-this": function(name) {


        //use request to query the omdb api and search by the name variable or if there is no 3rd argument, search for Mr. Nobody and return the data as a json object
        request("http://www.omdbapi.com/?t=" + (name || "Mr. + Nobody") + "&y=&plot=full&tomatoes=true&r=json", function(error, response, body) {

            var movies = body;
            var allMovies = "";

            //if there isn't any error and the response status code is in the 200s,
            if (!error && response.statusCode == 200) {

                var movieInfo = JSON.parse(body);
                var movieData = "Movie Name: " + movieInfo.Title + "\n" + "Year Released: " + movieInfo.Year + "\n" + "IMDB Rating: " + movieInfo.imdbRating + "\n" + "Country: " + movieInfo.Country + "\n" + "Language: " + movieInfo.Language + "\n" + "Plot Line: " + movieInfo.Plot + "\n" + "Actors: " + movieInfo.Actors + "\n" + "Rotten Tomatoes Rating: " + movieInfo.tomatoRating + "\n" + "Rotten Tomatoes URL: " + movieInfo.tomatoURL;
                allMovies += movieData;
                console.log(movieData);
            }
            //append the text file with the data
            fs.appendFile("./log.txt", allMovies + "\n", "utf8", function(error) {

                //if there is an error, log the error
                if (error) {
                    console.log(error);
                }
            });
        });

    },
    "do-what-it-says": function(action) {


        //use fs to read the text file
        fs.readFile('./random.txt', 'utf8', function(err, data) {

            //if there is an error
            if (err) {

                //exit the function and log the error
                return console.log(err);
            }
            //log the data
            console.log(data);

            //set the text in the file and split it up equal to a variable that is an array
            var textArray = data.split(",");

            //set text at the 0 index equal to a variable
            var actionStatement = textArray[0];

            //set text at the 0 index equal to a variable
            var namePhrase = textArray[1];
            actionObjects[actionStatement](namePhrase);

        });
    }

};
actionObjects[action](name);
