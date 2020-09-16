const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
     clientId: '',
     clientSecret: '',
});
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.listen(3000, () => {
     console.log('listening at 3000');
});
app.get('/', (req, res) => {
     res.render('index');
});
spotifyApi
     .clientCredentialsGrant()
     .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
     .catch((error) =>
          console.log(
               'Something went wrong when retrieving an access token',
               error
          )
     );
app.get('/artist-search', (req, res, next) => {
     spotifyApi
          .searchArtists(req.query.search)
          .then((data) => {
               // console.log('The received data from the API: ', data.body);
               // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
               console.log(data.body.artists.items.images);
               res.render('results', {
                    results: data.body.artists.items,
                    title: data.body.name,
               });
          })
          .catch((err) =>
               console.log('The error while searching artists occurred: ', err)
          );
});
// app.get('/results', (req, res) => {
//      res.render('results');
// });
app.get('/viewAlbums/:ID', (req, res) => {
     spotifyApi.getArtistAlbums(req.params.ID).then(
          function (data) {
               // console.log('Artist albums', data.body);
               res.render('viewAlbums', {
                    results: data.body.items,
                    title: data.body.name,
               });
          },
          function (err) {
               console.error(err);
          }
     );
});
app.get('/preview/:track', (req, res) => {
     spotifyApi.getAlbumTracks(req.params.track).then(
          function (data) {
               console.log('Artist albums', data.body);
               res.render('preview', {
                    results: data.body.items,
                    title: data.body.name,
               });
          },
          function (err) {
               console.error(err);
          }
     );
});
