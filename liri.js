require('dotenv').config();

var Spotify = require('node-spotify-api');
var request = require('request');
var axios = require('axios');
var fs = require('fs');
var keys = require('./keys');
var spotify = new Spotify(keys.spotify);
var moment = require('moment');

let input = process.argv[2];
// let userIn = process.argv[3];

if (input === 'spotify-this-song') {
    spotify_this_song(process.argv[3]);
} else if (input === 'movie-this') {
    movie_this(process.argv[3]);
} else if (input === 'do-what-it-says') {
    do_what_it_says();
} else {
    // Asks user to use one of the allowed functions
}

function spotify_this_song(song) {
    spotify.search({type: 'track', query: song ? song : 'The Sign Ace of Base'}, function(err, data) {
        if (err) {
            return console.log('Error Occurred: ' + err);
        }

        liriLog('-----------------------------------');
        for(let i = 0; i < data.tracks.items.length; i++) {
            let song = data.tracks.items[i];
            let toLog = '';

            if (song.artists[0].name) toLog += `Artist: ${song.artists[0].name}\r\n`;
            if (song.name) toLog += `Track Title: ${song.name}\r\n`;
            if (song.album.name) toLog += `Album: ${song.album.name}\r\n`;
            if (song.preview_url) toLog += `Preview of the song: ${song.preview_url}\r\n`;
            toLog += '-----------------------------------';

            liriLog(toLog);
        }
    })
}

function movie_this(movie) {
    if (movie) for (let i = 0; i < movie.length; i++) {
        if (movie[i] === ' ') movie[i] = '_';
    }
    axios.get(`http://www.omdbapi.com/?t=${movie ? movie : 'Mr._Nobody'}&apikey=trilogy`).then(
        function(response) {
            let data = response.data;
            let ratings = data.Ratings;
            let toLog = '-----------------------------------\r\n';

            toLog += `Movie Title: ${data.Title}\r\n`;
            toLog += `Release Date: ${data.Released}\r\n`;
            toLog += 'Ratings:\r\n';
            for (let rating of ratings) {
                toLog += `\t${rating.Source}: ${rating.Value}\r\n`;
            }
            toLog += `Country of Production: ${data.Country}\r\n`;
            toLog += `Language(s): ${data.Language}\r\n`;
            toLog += `Plot: ${data.Plot}\r\n`;
            toLog += `Main Cast: ${data.Actors}\r\n`;
            toLog += '-----------------------------------';

            liriLog(toLog);
        }
    )
}

function do_what_it_says() {
    fs.readFile('random.txt', 'utf8', (err, data) => {
        if (err) throw (err);
        data = data.split(',');
        let toCall = data[0];
        let input = data[1];

        if (toCall === 'concert-this') {
            concert_this(input);
        } else if (toCall === 'spotify-this-song') {
            spotify_this_song(input);
        } else if (toCall === 'movie-this') {
            movie_this(input);
        }
    })
}

function liriLog(data) {
    console.log(data);
    fs.appendFile('log.txt', data + '\r\n', (err) => {
        if (err) console.log(err);
    });
}