  var getLyrics = false;
  var trackInfo = {};

  DZ.init({
    appId  : '165345',
    channelUrl : 'http://localhost:3000/channel.html',
    player: {
      container: 'musicPlayer',
      width : 800,
      height : 300,
      onload : onMusicPlayerLoaded
    }
  });

  function onMusicPlayerLoaded()
  {

    /*DZ.Event.subscribe('player_play', function(arg){
      DZ.Event.subscribe('player_position', function(arg){
        if(arg[0] > 0 && arg[0] < 1){
          console.log()
        }
        console.log(arg);
        //event_listener_append('position', arg[0], arg[1]);
        //$(&quot;#slider_seek&quot;).find('.bar').css('width', (100*arg[0]/arg[1]) + '%');
      });
    });*/

    DZ.Event.subscribe('player_buffering', function(){
      if(!getLyrics){
        console.log(trackInfo);

        var posTitle = trackInfo.title.indexOf(' (Originally Performed by ');
        var strLngh = trackInfo.length;

        var trackName = trackInfo.title.substring(0,posTitle);
        var trackArtists = trackInfo.title.substring(posTitle, strLngh);

        console.log(trackName);
        console.log(strLngh);

        /*$.ajax({
          url :lyricsApiUrl+"matcher.track.get?q_artist="++"&q_track="+,
          data : {},
          jsonp : 'callback',
          success : function(albumData) {
          }
        });*/
      }
    });
  }

  function getTheLyrics()
  {
    //matcher.track.get?q_artist=eminem&q_track=lose%20yourself%20(soundtrack)
  }

	function httpGetAlbumTracks(apiUrl)
	{
    $.ajax({
        dataType: "jsonp",
        url :apiUrl+"/artist/"+artistId+"/albums?output=jsonp",
        data : {},
        jsonp : 'callback',
        success : function(albumData) {

          var listHTML = document.createElement('ul');
          albums = albumData;
          for (var album of albums.data) {

            $.ajax({
                dataType: "jsonp",
                url :apiUrl+"/album/"+album.id+"/tracks?output=jsonp",
                data : {},
                jsonp : 'callback',
                success : function(trackData) {

                  var listHTML = document.createElement('ul');
                  albumTracks = trackData;
                  for (var track of albumTracks.data) {

                      var trackData = '"'+encodeURIComponent(JSON.stringify(track))+'"'
                      listHTML.innerHTML += "<li><a href='#"+track.id+"' onclick='loadSpotifySong("+trackData+"); return false;'>"+track.title+"</a></li>";
                      document.getElementById('tracks').appendChild(listHTML);
                      songLinks = document.querySelectorAll('a'); 
                  }

                }
            });

          }
        }
    });

    function callback(data){
        console.log(data);
    };
	}

	function loadSpotifySong(track)
	{
    trackInfo = JSON.parse(decodeURIComponent(track));
    DZ.player.playTracks([trackInfo.id]);
	}


	var apiUrl = 'http://api.deezer.com';
  var lyricsApiUrl = 'http://api.musixmatch.com/ws/1.1/';
  var artistId = '321401';
	var albumTracks = songlinks = '';

	httpGetAlbumTracks(apiUrl);