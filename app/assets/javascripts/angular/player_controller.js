var myApp = angular.module('SongsPlayer', ["ui.bootstrap"]);

myApp.config(["$httpProvider", function($httpProvider) {
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
}
]);

myApp.controller('PlayerController', ['$scope', '$http', '$sce', function ($scope, $http, $sce) {
    $scope.songs_list = $('#player-container').data('content').songs.data;
    if($scope.songs_list.length != 0)
        $scope.current_song = $scope.songs_list[0];
    else
        $scope.current_song = {url: 'https://www.youtube.com/watch?v=Q3oItpVa9fs', video_id: 'Q3oItpVa9fs', title: 'CYMATICS: Science Vs. Music - Nigel Stanford'}

    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;
    window.onYouTubeIframeAPIReady = function() {
        player = new YT.Player('player', {
            height: '360',
            width: '100%',
            videoId: $scope.current_song.video_id,
            playerVars: {
                controls: 1,
                iv_load_policy: 3,
                showinfo: 1
            },
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    };

    function onPlayerStateChange(event) {
        if(event.data === 0) {
            if($scope.songs_list.indexOf($scope.current_song) != -1 && $scope.songs_list.indexOf($scope.current_song) != $scope.songs_list.length) {
                $scope.current_song = $scope.songs_list[$scope.songs_list.indexOf($scope.current_song) + 1];
                $scope.$apply();
                player.loadVideoById($scope.current_song.video_id);
                player.playVideo();
            }
        }
    }

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    };

    $scope.getIframeSrc = function (videoId) {
        return $scope.trustSrc('https://www.youtube.com/embed/' + videoId + '?enablejsapi=1');
    };

    $scope.addVideo = function() {
        if($scope.videoLink == null)
            return;
        var regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
        var match = $scope.videoLink.match(regExp);
        if (!match){
            return;
        }
        var videoId = match[2];
        var duplicate_link = false;
        angular.forEach($scope.songs_list, function (song) {
            if(song.video_id == videoId){
                alert('Song already in queue');
                duplicate_link = true;
            }
        });

        if(!duplicate_link) {
            $http({
                method: 'GET',
                url: "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&key=" + 'AIzaSyDBC9BGFNpVfw2IkqJUk0verLpt0m9x6VY' + "&fields=items(snippet(title))&part=snippet"
            }).success(function (response) {
                if(response.items.length > 0) {
                    $http({
                        method: 'POST',
                        url: '/player/add_song',
                        data: {url: $scope.videoLink, video_title: response.items[0].snippet.title, videoId: videoId}
                    }).success(function (response) {
                        $scope.songs_list.push(response);
                    })
                }
                else {
                    alert('Please enter a valid link');
                }
            }).error(function (res) {
                alert("Couldn't fetch video details");
            })
        }
    }
}]);