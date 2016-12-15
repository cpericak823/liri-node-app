//require npm packages
var request = require('request');
var Twitter = require('twitter');
var spotify = require('spotify');
var inquirer = require('inquirer');
var keys = require('./keys.js');
var fs = require('fs');

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
    console.log(tweets);

    //if there isn't an error, log the tweets and put them in a json object
    if (!error) {
        console.log(tweets);
    } else {
        console.log(error);
    }
});
