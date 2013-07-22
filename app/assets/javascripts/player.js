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
        this.playheaderTemplate = $('.playHeader .info');
        this.$playContainer = $('.playContainer');
        this.$playHeaderInfo = $('.playHeader .info');
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

function Track(artist, album, url, autoPlayUrl, apiName, songName) {
    this.artist = artist || '';
    this.album = album || '';
    this.url = url || '';
    this.autoPlayUrl = autoPlayUrl || '';
    this.apiName = apiName;
    this.songName = songName;
}


$(function () {
    Player.init();
    $('.play-track').live('click', function (e) {
        e.preventDefault();
        var el = $(this);
        Player.playTrack(new Track(
            el.data('artist'),
            el.data('album'),
            el.data('href'),
            el.data("autoplayUrl"),
            el.data('apiName'),
            el.data('songName')
        ))
    });
});
