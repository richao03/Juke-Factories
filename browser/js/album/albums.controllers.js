juke.controller('AlbumsCtrl', function($scope, $rootScope, $log, AlbumFactory) {
  AlbumFactory.fetchAll()
    .then(function(found) {
      var albumPromises = [];
      for (var i = 0; i < found.length; i++) {
        albumPromises.push(AlbumFactory.fetchById(found[i].id))
      }
      return Promise.all(albumPromises);
    })
    .then(function(albums) {
      $scope.albums = albums;
    })


  $scope.returnUrl = function(album) {
    return '/api/albums/' + album.id + '/image';
  }
});
