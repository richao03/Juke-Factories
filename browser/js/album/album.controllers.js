'use strict';

juke.controller('AlbumCtrl', function($scope, $http, $rootScope, $log, StatsFactory, AlbumFactory, PlayerFactory) {

  AlbumFactory.fetchAll()
    .then(function(albums) {
      return $http.get('/api/albums/' + albums[0].id); // temp: get one
    })
    .then(function(res) {
      return res.data; 
    })
    .then(function(album) {
      album.imageUrl = '/api/albums/' + album.id + '/image';
      album.songs.forEach(function(song, i) {
        song.audioUrl = '/api/songs/' + song.id + '/audio';
        song.albumIndex = i;
      });
      $scope.album = album;

      StatsFactory.totalTime(album)
        .then(function(albumDuration) {
          $scope.fullDuration = albumDuration;
        });
    })
    .catch($log.error); // $log service can be turned on and off; also, pre-bound


  AlbumFactory.fetchById()
    .then(function(found) {
      return (found)
    })

  // main toggle
  $scope.toggle = function (song) {
    console.log("PlayerFactory: ", PlayerFactory)
    if (PlayerFactory.isPlaying() && song === PlayerFactory.getCurrentSong()) {
      // $rootScope.$broadcast('pause');
      PlayerFactory.pause();
    } else if (!PlayerFactory.isPlaying() && song !== PlayerFactory.getCurrentSong()){
      PlayerFactory.start(song, $scope.album.songs);
    } else if (PlayerFactory.isPlaying() && song !== PlayerFactory.getCurrentSong()){
        PlayerFactory.start(song, $scope.album.songs);
    } else {
      PlayerFactory.resume();
    }
  };


  // incoming events (from Player, toggle, or skip)

  function pause () {
    PlayerFactory.pause();
  }

  function play (song, songList) {
    PlayerFactory.start(song, songList)
  };

  function next () { PlayerFactory.next() };
  function prev () { PlayerFactory.prev() };
});




