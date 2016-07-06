juke.controller('AlbumsCtrl', function  ($scope, $http, $rootScope, $log, StatsFactory, AlbumFactory) {
AlbumFactory.fetchAll()
.then(function(found){
  console.log(found)
 $scope.albums = found
})
})
