$(function(){
  loadDeck=function(deckName,deckLength){
     _(_.range($('.'+deckName+" img").length,deckLength)).each(function(sliden){
        $('<img />').attr('src',deckName+'/'+sliden+'.png') 
                   .addClass('s'+sliden)
                   .hide()
                   .appendTo('.'+deckName);
     });
     if(deckName=="screens"){
        $('.screens img').batchImageLoad({imageLoadedCallback:
          function(){
            loadDeck('slides',13);
        }});
     }
  }
  wireDeck=function(deckName,deckLength){
   var slide=0;
   var deltSlide=function(d){
      window.scrollTo(0, 1);

      $('.'+deckName+' .s'+slide).hide();
      slide+=d;
      if(slide>=deckLength){
        slide=0;
      }
      if(slide<0){
        slide=deckLength-1;
      }
      $('.'+deckName+' .s'+slide).show();
      if(slide>0){
        $('.instruct').fadeOut();
      }
    }
    deltSlide(0);
    $('.'+deckName).click(function(evt){
       deltSlide( evt.pageX<($(window).width()/2)?-1:+1);
    }).addSwipeEvents()
      .bind('swipeleft',function(){deltSlide(+1)})
      .bind('swiperight',function(){deltSlide(-1)});
  }

  syncOrientation=function(){
     window.scrollTo(0, 1);
     if(typeof(window.orientation)=="undefined"){
       loadDeck('slides',13);
       return;
     }
     var isVert=window.orientation%180==0;
     if(isVert){
       loadDeck('screens',8);
        $('.instruct').remove();
     }else{
       loadDeck('slides',13);
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
 
  wireDeck('slides',13);
  wireDeck('screens',8);
   $(window).resize(syncOrientation);

  fakeOrientation=function(deg){
    window.orientation=deg;
    syncOrientation();
  }
});

window.addEventListener('load', function(){
    setTimeout(scrollTo, 0, 0, 1);
  }, false);
