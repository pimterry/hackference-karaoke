  var getLyrics = false;
  var trackInfo = theLyrics = lineTime = {};

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

    DZ.Event.subscribe('player_position', function(arg){
      console.log(arg);

      //event_listener_append('position', arg[0], arg[1]);
      //$(&quot;#slider_seek&quot;).find('.bar').css('width', (100*arg[0]/arg[1]) + '%');
    });

    DZ.Event.subscribe('player_buffering', function(){
      if(!getLyrics){
        getLyrics = true;
        getTheLyrics();
      }
    });
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

  function getTheLyrics()
  {
      var songArt = /(.*) \(Originally Performed by (.*)\) \[Karaoke Version\]/.exec(trackInfo.title);

      $.ajax({
        dataType: "json",
        url: '/lyrics?artist='+songArt[2]+'&track='+songArt[1],
        data : {},
        success : function(lyricsData) {
          theLyrics = lyricsData.message.body.subtitle.subtitle_body;
          runThemLyrics(theLyrics);
        }
      });
  }

  function runThemLyrics(lyrics)
  {
    var reg = new RegExp(/\[0(.*)\] (.*)/gi);
    var result;
    var i = 0;
    while((result = reg.exec(lyrics)) !== null) {
      lineTime[result[1]] = result[2]
      i++;
    }
    for (firstLine in lineTime){ 
      var div = document.getElementById('lyrics');
      console.log(firstLine);
      console.log(lineTime);
      div.innerHTML = lineTime[firstLine.toString()]; 
      break;
    }
  }


	function loadSpotifySong(track)
	{
    trackInfo = JSON.parse(decodeURIComponent(track));
    DZ.player.playTracks([trackInfo.id]);
	}


	var apiUrl = 'http://api.deezer.com';
  var artistId = '321401';
	var albumTracks = songlinks = '';

	httpGetAlbumTracks(apiUrl);