var ytinterval = null;
var scduration = null;
var nowplayingtrackid = null;
var prevplayingtrackid = null;
var nextplayingtrackid = null;
var rndmplay = false;
var currentVolume = .5;

// callback function for errors
function onplayerError(errorid) {
	var $nowplaying = $("div#" + nowplayingtrackid);
	var thisLink = $nowplaying.children('.click-load').data('link');
	var thisType = $nowplaying.children('.click-load').data('type');
	var thisFBLink = $nowplaying.children('.linkfb').attr('href');
	var thisName = $nowplaying.children('.click-load').children('div.link-description-title').html();
	console.log('error loading track! error id: ' + errorid);
	$('#playpause').removeClass('pause');
	$('#playpause').addClass('play');
	var warningmsg = '<div id="loaderror' + nowplayingtrackid + '" class="alert alert-warning alert-dismissible alarm" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>Could NOT load ' + thisType + ' track</strong><br><a href="' + thisLink + '" target="_blank">' + thisName + '</a> <br><a href="' + thisFBLink + '" target="_blank">fb-post</a> <br>(GEMA/deleted)<br>skipping...</div>';
	$(warningmsg).appendTo('#playerframe');
	$("#loaderror" + nowplayingtrackid).delay(10000).fadeOut(300);
	loadNextTrack();
}

// initialize youtube player
var youtubeplayer;
function onYouTubeIframeAPIReady() {
	youtubeplayer = new YT.Player('ytapiplayer', {
		height: '0',
		width: '0',
		events: {
			'onError': onplayerError,
			'onStateChange': ytstatechange,
			'onReady': ytsetVol
		}
	});
}

function ytsetVol() {
	youtubeplayer.setVolume(50);
}

// load next track when youtube track finishes
function ytstatechange(arg) {
	if (arg.data == 0) {
		loadNextTrack();
	}
}

// initialize soundcloud player
SC.initialize({client_id: "cda3a2600c3d79c22651d6b287cb2c1a"});
var widgetIframe = document.getElementById('scapiplayer'),
	soundcloudplayer = SC.Widget(widgetIframe);

soundcloudplayer.bind(SC.Widget.Events.READY, function () {
	soundcloudplayer.bind(SC.Widget.Events.ERROR, onplayerError);
	soundcloudplayer.bind(SC.Widget.Events.FINISH, loadNextTrack);
	soundcloudplayer.bind(SC.Widget.Events.PLAY_PROGRESS, function () {
		soundcloudplayer.getPosition(function (position) {
			soundcloudplayer.getDuration(function (dur) {
				scduration = dur;
				if (position > 0) {
					value = (100 / dur) * position;
					$('#scseeker').attr('aria-valuenow', value);
					$('#scseeker').css('width', value + '%');
				}
			});

		});
	});
});

// pause all playback
function stopAll() {
	soundcloudplayer.pause();
	youtubeplayer.pauseVideo();
	$('#playpause').removeClass('pause').addClass('play');
}

// assign playbutton to playertype
function assignPlay(type) {
	$('#last-track').unbind('click');
	$('#next-track').unbind('click');
	$('#playpause').unbind('click');
	if (type == 'youtube') {
		setytProgress();
		$('#next-track').on('click', loadNextTrack);
		$('#last-track').on('click', loadPrevTrack);
		$('#playpause').on('click',
			function () {
				if ($('#playpause').hasClass('play')) {
					$('#playpause').removeClass('play').addClass('pause');
					youtubeplayer.playVideo();
				} else if ($('#playpause').hasClass('pause')) {
					$('#playpause').removeClass('pause').addClass('play');
					youtubeplayer.pauseVideo();
				}
			});
	}
	if (type == 'soundcloud') {
		setscProgress();
		$('#next-track').on('click', loadNextTrack);
		$('#last-track').on('click', loadPrevTrack);
		$('#playpause').on('click',
			function () {
				if ($('#playpause').hasClass('play')) {
					$('#playpause').removeClass('play').addClass('pause');
					soundcloudplayer.play();
				} else if ($('#playpause').hasClass('pause')) {
					$('#playpause').removeClass('pause').addClass('play');
					soundcloudplayer.pause();
				}
			});
	}
}

// track load functions
function loadYouTube(link) {
	stopAll();
	var linkID = link.substr(link.length - 11);
	youtubeplayer.loadVideoById({videoId: linkID});
	ytinterval = setInterval("updateytProgress()", 250);
	$('#playpause').removeClass('play').addClass('pause');
	colorCurrentTrack();
}
function loadSoundCloud(link) {
	stopAll();
	SC.get('/resolve', { url: link }, function (track) {
		var isDef = track.id;
		if (isDef != undefined) {
			soundcloudplayer.load(link, { callback: function () {
				soundcloudplayer.play();
				soundcloudplayer.setVolume(currentVolume);
			}
			});
			clearInterval(ytinterval);
			$('#playpause').removeClass('play').addClass('pause');
			colorCurrentTrack();
		}
		if (isDef == undefined) {
			clearInterval(ytinterval);
			$('#playpause').removeClass('play').addClass('pause');
			colorCurrentTrack();
			onplayerError();
		}
	});
}

// initialize load on click
function clickLoad() {
	$('.click-load').on('click', function () {
		var link = $(this).data('link');
		var type = $(this).data('type');
		var fblink = $(this).next('a.linkfb').attr('href');
		var name = $(this).children('div.link-description-title').html();
		var clickID = $(this).closest("div.trackframes").attr("id");
		if (type == 'youtube') {
			prevplayingtrackid = nowplayingtrackid;
			if (prevplayingtrackid == null) {
				prevplayingtrackid = clickID
			}
			nowplayingtrackid = clickID;
			$('#nowplaying').html(name);
			$('#inplayerlinks').html("<a href='" + fblink + "' target='_blank' class='linkfbplayer'><img class='round pic' src='img/Facebook_icon_2013.svg'></a><a href='" + link + "' target='_blank' class='linkpicplayer'><img class='round pic' src='img/" + type + "-icon.png'></a>");
			loadYouTube(link);
			assignPlay(type);
		}
		if (type == 'soundcloud') {
			prevplayingtrackid = nowplayingtrackid;
			if (prevplayingtrackid == null) {
				prevplayingtrackid = clickID
			}
			nowplayingtrackid = clickID;
			$('#nowplaying').html(name);
			$('#inplayerlinks').html("<a href='" + fblink + "' target='_blank' class='linkfbplayer'><img class='round pic' src='img/Facebook_icon_2013.svg'></a><a href='" + link + "' target='_blank' class='linkpicplayer'><img class='round pic' src='img/" + type + "-icon.png'></a>");
			loadSoundCloud(link);
			assignPlay(type);
		}
	})
}

// initialize random button
function initRandom() {
	var $randomID = $('#random');
	$randomID.removeClass('rndm-on').addClass('rndm-off');
	$randomID.css('color', 'red');
	rndmplay = false;
	$randomID.on('click', function () {
		if (rndmplay == false) {
			$randomID.removeClass('rndm-off').addClass('rndm-on');
			$randomID.css('color', 'green');
			rndmplay = true;
		} else if (rndmplay == true) {
			$randomID.removeClass('rndm-on').addClass('rndm-off');
			$randomID.css('color', 'red');
			rndmplay = false;
		}
	})
}

// initialize youtubeprogressbar
function setytProgress() {
	$('#scseeker').hide();
	$('#ytseeker').show();
	$('#seeker').unbind('click');
	$('#seeker').click(function (e) {
		var aussen = $('#seeker').css('width');
		var aussen1 = parseInt(aussen);
		var klick;
		if (typeof e.offsetX === "undefined") {
			klick = e.pageX - $(e.target).offset().left;
		} else {
			klick = e.offsetX;
		}
		var pct = klick / aussen1;
		var duration = youtubeplayer.getDuration();
		var gotopos = pct * duration;
		youtubeplayer.seekTo(gotopos);
	});
}

// initialize soundcloudprogressbar
function setscProgress() {
	$('#ytseeker').hide();
	$('#scseeker').show();
	$('#seeker').unbind('click');
	$('#seeker').click(function (e) {
		var aussen = $('#seeker').css('width');
		var aussen1 = parseInt(aussen);
		var klick;
		if (typeof e.offsetX === "undefined") {
			klick = e.pageX - $(e.target).offset().left;
		} else {
			klick = e.offsetX;
		}
		var pct = klick / aussen1;
		var duration = scduration;
		var gotopos = pct * duration;
		soundcloudplayer.seekTo(gotopos);
	});
}

// update youtube progressbar
function updateytProgress() {
	var now = youtubeplayer.getCurrentTime();
	var dur = youtubeplayer.getDuration();
	var value = (100 / dur * now);
	$('#ytseeker').attr('aria-valuenow', value);
	$('#ytseeker').css('width', value + '%');
}

// load track from next div into player
function loadNextTrack() {
	var currentTrack = nowplayingtrackid;
	if ($("div#" + currentTrack).length > 0 && rndmplay == false) {
		var $thisdiv = $("div#" + currentTrack);
		nextplayingtrackid = $thisdiv.next().attr("id");
		var nextLink = $thisdiv.next().children('.click-load').data('link');
		var nextType = $thisdiv.next().children('.click-load').data('type');
		var nextName = $thisdiv.next().children('.click-load').children('div.link-description-title').html();
		var fblink = $thisdiv.next().children('.linkfb').attr('href');
		scrolltoTrack(currentTrack);
	} else if (rndmplay == true) {
		var IDs = [];
		var i = 0;
		$("#linkoverlay").find("div.trackframes").each(function () {
			IDs.push(this.id);
		});
		var random = getRandomNumber(1, IDs.length);
		var rndm = IDs.slice(random - 1, random);
		nextplayingtrackid = rndm;
		var $thisdiv = $("#" + rndm + ".trackframes");
		var nextLink = $thisdiv.children('.click-load').data('link');
		var nextType = $thisdiv.children('.click-load').data('type');
		var nextName = $thisdiv.children('.click-load').children('div.link-description-title').html();
		var fblink = $thisdiv.children('.linkfb').attr('href');
		scrolltoTrack(rndm);
	} else {
		var $thisdiv = $(".trackframes:first");
		nextplayingtrackid = $thisdiv.attr("id");
		var nextLink = $thisdiv.children('.click-load').data('link');
		var nextType = $thisdiv.children('.click-load').data('type');
		var nextName = $thisdiv.children('.click-load').children('div.link-description-title').html();
		var fblink = $thisdiv.children('.linkfb').attr('href');
		scrolltoTrack(nextplayingtrackid);
	}
	prevplayingtrackid = nowplayingtrackid;
	nowplayingtrackid = nextplayingtrackid;
	if (nextType == 'youtube') {
		$('#nowplaying').html(nextName);
		$('#inplayerlinks').html("<a href='" + fblink + "' target='_blank' class='linkfbplayer'><img class='round pic' src='img/Facebook_icon_2013.svg'></a><a href='" + nextLink + "' target='_blank' class='linkpicplayer'><img class='round pic' src='img/" + nextType + "-icon.png'></a>");
		loadYouTube(nextLink);
		assignPlay(nextType);
	}
	if (nextType == 'soundcloud') {
		$('#nowplaying').html(nextName);
		$('#inplayerlinks').html("<a href='" + fblink + "' target='_blank' class='linkfbplayer'><img class='round pic' src='img/Facebook_icon_2013.svg'></a><a href='" + nextLink + "' target='_blank' class='linkpicplayer'><img class='round pic' src='img/" + nextType + "-icon.png'></a>");
		loadSoundCloud(nextLink);
		assignPlay(nextType);
	}
}

// load track from prev div into player
function loadPrevTrack() {
	var currentTrack = nowplayingtrackid;
	if ($("div#" + currentTrack).length > 0) {
		var prevID = $("div#" + currentTrack).prev().attr("id");
		var prevLink = $("div#" + currentTrack).prev().children('.click-load').data('link');
		var prevType = $("div#" + currentTrack).prev().children('.click-load').data('type');
		var prevName = $("div#" + currentTrack).prev().children('.click-load').children('div.link-description-title').html();
		var fblink = $("div#" + currentTrack).prev().children('.linkfb').attr('href');
		scrolltoTrack(prevID);
	} else {
		var prevID = $(".trackframes:first").attr("id");
		var prevLink = $(".trackframes:first").children('.click-load').data('link');
		var prevType = $(".trackframes:first").children('.click-load').data('type');
		var prevName = $(".trackframes:first").children('.click-load').children('div.link-description-title').html();
		var fblink = $(".trackframes:first").children('.linkfb').attr('href');
		scrolltoTrack(prevID);
	}
	nowplayingtrackid = prevplayingtrackid;
	nowplayingtrackid = prevID;
	if (prevType == 'youtube') {
		$('#nowplaying').html(prevName);
		$('#inplayerlinks').html("<a href='" + fblink + "' target='_blank' class='linkfbplayer'><img class='round pic' src='img/Facebook_icon_2013.svg'></a><a href='" + prevLink + "' target='_blank' class='linkpicplayer'><img class='round pic' src='img/" + prevType + "-icon.png'></a>");
		loadYouTube(prevLink);
		assignPlay(prevType);
	}
	if (prevType == 'soundcloud') {
		$('#nowplaying').html(prevName);
		$('#inplayerlinks').html("<a href='" + fblink + "' target='_blank' class='linkfbplayer'><img class='round pic' src='img/Facebook_icon_2013.svg'></a><a href='" + prevLink + "' target='_blank' class='linkpicplayer'><img class='round pic' src='img/" + prevType + "-icon.png'></a>");
		loadSoundCloud(prevLink);
		assignPlay(prevType);
	}
}

// color current track green and previous track grey again
function colorCurrentTrack() {
	$("div#" + prevplayingtrackid).children('.click-load').children('div.link-description-title').css('background-color', '#e9eaed');
	$("div#" + nowplayingtrackid).children('.click-load').children('div.link-description-title').css('background-color', '#BCED91');
	$("div#" + nowplayingtrackid).next().children('.click-load').children('div.link-description-title').css('background-color', '#e9eaed');
}

// initialize volume bar
function setVolumeBar() {
	soundcloudplayer.setVolume(currentVolume);
	if (youtubeplayer) {
		youtubeplayer.setVolume(currentVolume * 100);
	}
	;
	$('#volume').click(function (e) {
		var aussen = $('#volume').css('width');
		var aussen1 = parseInt(aussen);
		if (typeof e.offsetX === "undefined") {
			var klick = e.pageX - $(e.target).offset().left;
		} else {
			var klick = e.offsetX;
		}
		;
		var pct = klick / aussen1;
		soundcloudplayer.setVolume(pct);
		youtubeplayer.setVolume(pct * 100);
		currentVolume = pct;
		$('#innervolume').attr('aria-valuenow', pct * 100);
		$('#innervolume').css('width', pct * 100 + '%');
		$('#mute').removeClass('glyphicon-volume-off').addClass('glyphicon-volume-up');
	});
	$('#mute').on('click', function (e) {
		if ($('#mute').hasClass('glyphicon-volume-up')) {
			$('#mute').removeClass('glyphicon-volume-up').addClass('glyphicon-volume-off');
			soundcloudplayer.setVolume(0);
			youtubeplayer.setVolume(0);
			$('#innervolume').attr('aria-valuenow', 0);
			$('#innervolume').css('width', '0%');
		} else if ($('#mute').hasClass('glyphicon-volume-off')) {
			$('#mute').removeClass('glyphicon-volume-off').addClass('glyphicon-volume-up');
			soundcloudplayer.setVolume(currentVolume);
			youtubeplayer.setVolume(currentVolume * 100);
			$('#innervolume').attr('aria-valuenow', currentVolume * 100);
			$('#innervolume').css('width', currentVolume * 100 + '%');
		}
	});
}

