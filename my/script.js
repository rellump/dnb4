//ajax call for livesearch
function search(group) {
    var query_value = $('input#srch-term').val();
    $.ajax({
      type: "POST",
      url: group+".php",
      data: { query: query_value },
      cache: false,
      success: function(html){
        $("#linkoverlay").html(html);
        clickLoad();
        colorCurrentTrack();
      }
    });
}
// 100ms delay after keyup to stop spam
function delaySearch(group) {
  $("input#srch-term").unbind( "keyup" );
  $("input#srch-term").on("keyup", function() {
      clearTimeout($.data(this, 'timer'));
      $(this).data('timer', setTimeout(search(group), 100));
  });
}
//initialize navigation bar onClick
function navClicks() {
  $('a.navclicker').on('click', function(e) {
    var clicked = e.target.id;
    $('a.navclicker').parent().removeClass("active");
    $("#"+clicked).parent().addClass("active");
    search(clicked);
    delaySearch(clicked);
  });
}

//get random number betweeen min and max
function getRandomNumber (min, max) {return Math.floor(Math.random() * (max - min + 1)) + min;};

function updateStyleSheet() {
    if ( $('body').width() < 768 ) {
        $("head").append("<link>");
        css = $("head").children(":last");
        css.attr({
          id: "dynamic_css",
          rel:  "stylesheet",
          type: "text/css",
          href: "my/small.css"
        });
    } else if ($('body').width() >= 768) {
        $("head").append("<link>");
        css = $("head").children(":last");
        css.attr({
          id: "dynamic_css",
          rel:  "stylesheet",
          type: "text/css",
          href: "my/big.css"
        });
    }
 
}

function scrolltoTrack(arg) {
  if ($('#'+arg).visible() == false){
    document.getElementById(arg).scrollIntoView(true);
  }
}
