$(function(){
  slides={deckName:'slides',deckLength:13,width:800,height:600};
  screens={deckName:'screens',deckLength:8,height:418,width:320};

  loadDeck=function(op){
     _(_.range($('.'+op.deckName+" img").length,op.deckLength)).each(
       function(sliden){
         var $holder = $('<div ><p>Spacetravlr<br/>loading ('+sliden+') ...</p></div>')
                           .addClass('s'+sliden)
                           .appendTo('.'+op.deckName);
          var $img=$('<img />').attr({height:op.height});
          $img.load(function(){
                 $holder.html($img.get(0));
                    if(op.deckName=="screens"&&sliden==op.deckLength-1){
                      $('.screens img').batchImageLoad({
                        imageLoadedCallback: function(){
                          loadDeck('slides',13);
                      }});
                    }
                })
               .attr('src',op.deckName+'/'+sliden+'.png');
          if(sliden>0){
            $holder.hide();
          }
     });
  }
  wireDeck=function(op){
   var slide=0;
   var deltSlide=function(d){
      window.scrollTo(0, 1);

      $('.'+op.deckName+' .s'+slide).hide();
      slide+=d;
      if(slide>=op.deckLength){
        slide=0;
      }
      if(slide<0){
        slide=op.deckLength-1;
      }
      $('.'+op.deckName+' .s'+slide).show();
      if(slide>0){
        $('.instruct').fadeOut();
      }
    }
    deltSlide(0);
    $('.'+op.deckName).click(function(evt){
       deltSlide( evt.pageX<($(window).width()/2)?-1:+1);
    }).addSwipeEvents()
      .bind('swipeleft',function(){deltSlide(+1)})
      .bind('swiperight',function(){deltSlide(-1)});
  }

  syncOrientation=function(){
     window.scrollTo(0, 1);
     if(typeof(window.orientation)=="undefined"){
       loadDeck(slides);
       return;
     }
     var isVert=window.orientation%180==0;
     if(isVert){
       loadDeck(screens);
        $('.instruct').remove();
     }else{
       loadDeck(slides);
     }
     var sel = (isVert)?"slides":"screens";
     $('.slides,.screens').show();
     $('.'+sel).hide();

     var targetH=0;
     if(navigator.userAgent.match(/iphone/i)){
        targetH=isVert?416:268;
     }else{
        targetH=$('body').height();
     }
     $('.slides img,.screens img').css({height:targetH});
  }

  window.onorientationchange=syncOrientation;
  syncOrientation();
 
  wireDeck(slides);
  wireDeck(screens);
   $(window).resize(syncOrientation);

  fakeOrientation=function(deg){
    window.orientation=deg;
    syncOrientation();
  }
});

window.addEventListener('load', function(){
    setTimeout(scrollTo, 0, 0, 1);
  }, false);
