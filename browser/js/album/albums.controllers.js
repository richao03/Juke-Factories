juke.controller('AlbumsCtrl', function  ($scope, $http, $rootScope, $log, StatsFactory, AlbumFactory) {
AlbumFactory.fetchAll()
.then(function(found){
 $scope.albums = found
for (var i = 0; i < found.length; i++) {
   found[i].imageUrl = "/api/albums/" + found[i].id + '/image'
}
console.log(found)
 return found
})

})



