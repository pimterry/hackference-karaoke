  DZ.init({
    appId  : '165345',
    channelUrl : 'http://localhost:3000/channel.html',
    player: {
      container: 'musicPlayer',
      width : 800,
      height : 300,
      onload : function(){
          //DZ.player.playTracks([3135556, 1152226]);
      }
    }
  });

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

                    var shitHead = '"'+track.id+'"'
                    listHTML.innerHTML += "<li><a href='#"+track.id+"' onclick='loadSpotifySong("+shitHead+"); return false;'>"+track.title+"</a></li>";
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

	function loadSpotifySong(songID)
	{
    DZ.player.playTracks([songID]);
	}


	var apiUrl = 'http://api.deezer.com';
  var artistId = '321401';
	var albumTracks = songlinks = '';

	httpGetAlbumTracks(apiUrl);