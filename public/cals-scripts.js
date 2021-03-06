  var getLyrics = false;
  var curPos = 0;
  var trackInfo = {};
  var theLyrics = {};
  var lineTime = {};
  var posKeys = {};
  var countDown = 0;

  DZ.init({
    appId  : '165345',
    channelUrl : 'https://hackference-karaoke.herokuapp.com/channel.html',
    player: {
      container: 'musicPlayer',
      width : 800,
      height : 300,
      onload : onMusicPlayerLoaded
    }
  });

  function onMusicPlayerLoaded()
  {
    var i = 0;
    countDown = posKeys[0];
    DZ.Event.subscribe('player_position', function(arg){

      countDown = parseInt(parseInt(posKeys[i]) - arg[0]+1);

      if((arg[0]) >= posKeys[i]){
        var div = document.getElementById('lyrics');
        var currentLyric = lineTime[posKeys[i]];
        div.innerHTML = currentLyric;
        
        var nextDiv = document.getElementById('nextLine');
        var nextLyric = lineTime[posKeys[i+1]];
        nextDiv.innerHTML = nextLyric;

        pushLyrics(currentLyric, nextLyric);

        i++;
      }

        if(countDown < 0 ){
          countDown = posKeys[i];
        }

        
        var countd = document.getElementById('countDown');
        countd.innerHTML = countDown.toString()+'s';
    });

    DZ.Event.subscribe('player_buffering', function(){
      if(!getLyrics){
        getLyrics = true;
        getTheLyrics();
      }
    });
  }

  function pushLyrics(current, next) {
    $.post('/lyrics-update', {
      name: window.roomName,
      current: current,
      next: next
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
      var a = result[1].split(':');
      var seconds = parseInt((a[0]* 60)) + parseInt(a[1]);
      lineTime[seconds] = result[2];
      posKeys[i] = seconds.toString();
      i++;
    }
    var div = document.getElementById('lyrics');
    var currentLyric = "** intro **";
    div.innerHTML = currentLyric;
    
    var nextDiv = document.getElementById('nextLine');
    var nextLyric = lineTime[posKeys[0]];
    nextDiv.innerHTML = nextLyric;

    pushLyrics(currentLyric, nextLyric);

    jQuery('html, body').animate({
        scrollTop: $("#lyrics").offset().top
    }, 300);
  }


	function loadSpotifySong(track)
	{
    trackInfo = JSON.parse(decodeURIComponent(track));
    DZ.player.playTracks([trackInfo.id]);
    jQuery.fn.fullpage.moveSlideRight();
	}


	var apiUrl = 'https://api.deezer.com';
  var artistId = '321401';
	var albumTracks = songlinks = '';

	httpGetAlbumTracks(apiUrl);
