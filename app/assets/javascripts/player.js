var doNothing = function () {
};
var Player = {
    init: function () {
        $('.playContainer .closeButton').bind('click', function () {
            Player.unloadCurrentTrack();
            $('.playContainer').hide();
            $('.playFrame').replaceWith($('<iframe/>').addClass('playFrame'));
        });
        $('.playContainer .minimizeButton').bind('click', function () {
            $('.playContainer').toggleClass('minimized');
        });
        this.playheaderTemplate = $('.playHeader .song-name');
        this.$playContainer = $('.playContainer');
        this.$playHeaderInfo = $('.playHeader .song-name');
        this.$playContainerSpacer = $('.playContainerSpacer');
    },

    unloadCurrentTrack: doNothing,

    playTrack: function (track) {
        var embedHeight = '196px';

        if (track.apiName == 'spotify') {
            embedHeight = '113px';
            // Load the spotify URI in an iframe so it doesn't trigger onbeforeunload in Grooveshark embed
            $('.spotifyTarget')[0].src = track.url;
            Player.unloadCurrentTrack = function () {
                // Induce a track stop in the Spotify client by using a uri hash trick.
                // "spotify:track:abcdefg#1:45" seeks to 1:45.
                // Seek to 999:59 to end the song.
                Player.unloadCurrentTrack = doNothing;
                $('.spotifyTarget')[0].src = track.url + "%23999:59";
            };
        } else {
            setTimeout(Player.unloadCurrentTrack, 1500);
        }

        this.$playContainer.show();
        this.$playContainerSpacer.show();

        this.$playContainer.css('height', embedHeight);
        var playClass = (this.$playContainer.hasClass('minimized') && 'minimized ') + (track.apiName || '');
        this.$playContainer.attr('class', 'playContainer ' + playClass);
        this.$playHeaderInfo.html(track.songName);

        $('.playFrame').replaceWith($('<iframe/>').addClass('playFrame'));
        if (track.apiName == 'youtube') {
            // Youtube has a minimum embed height requirement. Workaround.
            $('.playFrame').css('height', '300px');
            setTimeout(function () {
                $('.playFrame').css('height', '165px');
            }, 3000);
        }
        $('.playFrame').attr('src', track.autoPlayUrl);
    }
};

function Track(artist, album, url, autoPlayUrl, apiName, songName, thumbnail, key) {
    this.artist = artist || '';
    this.album = album || '';
    this.url = url || '';
    this.autoPlayUrl = autoPlayUrl || '';
    this.apiName = apiName || '';
    this.songName = songName || '';
    this.thumbnail = thumbnail || 'http://soundseekr.com/assets/logo_2.png';
    this.key = key || '';
}



function postToFeed() {

    var obj = {
        method: 'feed',
        link: 'http://soundseekr.com/musicmasti?search_fild=' + current_query + '&track_key=' + current_track.key + '&provider=' + current_track.apiName,
        display: 'dialog',
        picture: current_track.thumbnail,
        name: "SoundSeekr | " + current_track.songName,
        description: "Get the links to listen to '" + current_track.songName + "' on http://soundseekr.com (Find any sound)",
        actions: [
            { name: 'Find any sound !', link: 'http://soundseekr.com' }
        ]
    };

    function callback(response) {
    }

    FB.ui(obj, callback);
}
;
window.fbAsyncInit = function () {
    FB.init({ appId: '555621547808910', cookie: true, status: true, xfbml: true });
};

$(function () {
    current_track = new Track();
    Player.init();
    $('.play-track').live('click', function (e) {
        e.preventDefault();
        var el = $(this);
        current_track = new Track(
            el.data('artist'),
            el.data('album'),
            el.data('href'),
            el.data("autoplayUrl"),
            el.data('apiName'),
            el.data('songName'),
            el.data('thumbnail'),
            el.data('key')
        )
        Player.playTrack(current_track)
    });
});
