const express = require('express');
const bodyParser = require('body-parser');
const Playlist = require('./models/playlist');
const Artist = require('./models/artist');
const Album = require('./models/album');
const Track = require('./models/track');
const Sequelize = require('sequelize');

const { Op } = Sequelize;
const app = express();

app.use(bodyParser.json());

//define relationship between Artists and Albums
Artist.hasMany(Album,{
  foreignKey: 'ArtistId'
});

Album.belongsTo(Artist,{
  foreignKey: 'ArtistId'
})

Playlist.belongsToMany(Track, {
  through: 'playlist_track',
  foreignKey: 'PlaylistId',
  timestamps: false
});

Track.belongsToMany(Playlist, {
  through: 'playlist_track',
  foreignKey: 'TrackId',
  timestamps: false
});

app.patch('/api/tracks/:id', function(request, response){
 let { id } = request.params;

 //three outcomes
 //1) successful update - show json and 200 code
 //2) fail validation - show errors and 204 code
 //3) track not found - empty and 404 code

  Track.findByPk(id)
    .then((track) =>{
      if (track){
        return track.update({
          name: request.body.name,
          milliseconds: request.body.milliseconds,
          unitPrice: request.body.unitPrice
        });
      } else {
        return Promise.reject();
      }
    })
    .then((track) => {
      //successful update
      response.status(200).json(track);
    },(validation) => {
      response.status(422).json({
      errors: validation.errors.map((error) => {
        return{
          attribute: error.path,
          message: error.message
        }
      })
    })
  })
  .then(() => {}, () =>{
    response.status(404).send();
  });
});

app.delete('/api/playlists/:id', function (request, response){
  //find playlist we want to delete
  let { id } = request.params;

  //destroy playlist (make orphaned records)
  Playlist
    .findByPk(id)
    .then((playlist) =>{
      if (playlist){
        //deletes all join table tracks
        return playlist.setTracks([]).then(() =>{
          return playlist.destroy();
        });
      } else{
        return Promise.reject();
      }
    })
    .then(() =>{
      //successful status
      response.status(204).send();
    }, () => {
      response.status(404).send();
    });
});

app.post('/api/artists', function(request, response){
  Artist.create({
    name: request.body.name
  }).then((artist) => {
    response.json(artist);
  }, (validation) =>{
    response.status(422).json({
      errors: validation.errors.map((error) =>{
        return {
          attribute: error.path,
          message: error.message
        }
      })
    });
  });
});

app.get('/api/playlists', function (request, response){
  let filter = {};
  let { q } = request.query;

  if(q){
    filter = {
      where: {
        name: {
          [Op.like]: `${q}%`
        }
      }
    }
  }


  Playlist.findAll(filter).then((playlists) =>{
    response.json(playlists);
  });
});

app.get('/api/playlists/:id', function (request, response){
  let { id } = request.params;
  //let id = request.params.id;

  Playlist.findByPk(id, {
    include: [Track]
  }).then((playlist) =>{
    if (playlist){
      response.json(playlist);
    } else{
      response.status(404).send();
    }
  });
});

app.get('/api/artists/:id', function (request, response){
  let { id } = request.params;
  //let id = request.params.id;

  Artist.findByPk(id, {
    include: [Album]
  }).then((artist) =>{
    if (artist){
      response.json(artist);
    } else{
      response.status(404).send();
    }
  });
});

app.get('/api/albums/:id', function (request, response){
  let { id } = request.params;
  //let id = request.params.id;

  Album.findByPk(id, {
    include: [Artist]
  }).then((album) =>{
    if (album){
      response.json(album);
    } else{
      response.status(404).send();
    }
  });
});

app.get('/api/tracks/:id', function (request, response){
  let { id } = request.params;
  //let id = request.params.id;

  Track.findByPk(id, {
    include: [Playlist]
  }).then((track) =>{
    if (track){
      response.json(track);
    } else{
      response.status(404).send();
    }
  });
});

app.listen({port: process.env.PORT || 8000});
