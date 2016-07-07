'use strict';

juke.factory('PlayerFactory', function($http, $rootScope) {
  // non-UI logic in here
  var mod = function(num, m) {
    return ((num % m) + m) % m;
  }

  var skip = function(interval) {
    if (!currentSong) return;
    var index = currentSong.albumIndex;
    console.log("currentAlbum: ", currentAlbum)
    index = mod((index + (interval || 1)), currentAlbum.length);
    PlayerFactory.start(currentAlbum[index], currentAlbum);
  }

  var PlayerFactory = {};
  var currentAlbum = null;
  var currentSong = null;
  var playing = false;
  var progress = 0;
  var audio = document.createElement('audio');
  // audio.playbackRate = 40;

  audio.addEventListener('ended', function() {
    PlayerFactory.next();
    $rootScope.$evalAsync(); // likely best, schedules digest if none happening
  });


  audio.addEventListener('timeupdate', function() {
    progress = audio.currentTime / audio.duration;
    // console.log(progress);
    $rootScope.$evalAsync();
  });


  PlayerFactory.start = function(song, songList) {
      PlayerFactory
        .pause();
      if (songList != null) {
        currentAlbum = songList;
        currentAlbum.forEach(function(song, index) {
          song.albumIndex = index;
        });
      }
      currentAlbum = songList;
      playing = true;
      currentSong = song;
      audio.src = song.audioUrl;
      audio.load();
      audio.play();
    }

  PlayerFactory.pause = function() {
      audio.pause();
      playing = false;
    }

  PlayerFactory.resume = function() {
      playing = true;
      return audio.play();
    }

  PlayerFactory.isPlaying = function() {
      return playing;
    }

  PlayerFactory.getCurrentSong = function() {
      return currentSong;
    }

  PlayerFactory.next = function() {
      audio.pause();
      skip(1);
    }

  PlayerFactory.previous = function() {
      audio.pause();
      skip(-1);
    }

  PlayerFactory.getProgress = function() {
      return progress;
      // $rootScope.$digest();
      // return  audio.currentTime / audio.duration;
    }

  return PlayerFactory;
});


juke.factory('StatsFactory', function($q) {
  var statsObj = {};
  statsObj.totalTime = function(album) {
    var audio = document.createElement('audio');
    return $q(function(resolve, reject) {
      var sum = 0;
      var n = 0;

      function resolveOrRecur() {
        if (n >= album.songs.length) resolve(sum);
        else audio.src = album.songs[n++].audioUrl;
      }
      audio.addEventListener('loadedmetadata', function() {
        sum += audio.duration;
        resolveOrRecur();
      });
      resolveOrRecur();
    });
  };
  return statsObj;
});




juke.factory('AlbumFactory', function($http) {
  var AlbumFactory = {}
  AlbumFactory.fetchAll = function() {
    return $http.get('/api/albums/')
      .then(function(response) {
        return response.data;
      })
  }

  AlbumFactory.fetchById = function(number) {
    return $http.get('/api/albums/' + number)
      .then(function(response) {
        return response.data;
      })
  }

  return AlbumFactory
})
