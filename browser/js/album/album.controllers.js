'use strict';

juke.controller('AlbumCtrl', function($scope, $http, $rootScope, $log, StatsFactory, AlbumFactory, PlayerFactory) {


  $scope.playing = PlayerFactory.isPlaying()
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


  // AlbumFactory.fetchById()
  //   .then(function(found) {
  //     return (found)
  //   })

  // main toggle
  $scope.toggle = function (song) {
    console.log("song" , song)
       if (PlayerFactory.isPlaying() && song === PlayerFactory.getCurrentSong()) {
      // $rootScope.$broadcast('pause');
      pause();
    } else if (!PlayerFactory.isPlaying() && song !== PlayerFactory.getCurrentSong()){
      play(song, $scope.album.songs)
         $scope.playing = true;
    } else if (PlayerFactory.isPlaying() && song !== PlayerFactory.getCurrentSong()){
        play(song, $scope.album.songs)
           $scope.playing = true;
    } else {
      PlayerFactory.resume()
         $scope.playing = true;
    }

  };


  // incoming events (from Player, toggle, or skip)

//invoke PlayerFactory methods inside the functions in the controller
  function pause () {
    PlayerFactory.pause();
    $scope.playing = false
  }

  function play (song, songList) {
    PlayerFactory.start(song, songList)
    $scope.currentSong = PlayerFactory.getCurrentSong()
    $scope.playing = true
  };

  function next () { PlayerFactory.next() };
  function prev () { PlayerFactory.prev() };
});




