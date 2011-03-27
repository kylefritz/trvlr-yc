$(function(){

  wireDeck=function(deckName,deckLength){
   //insert slides
   _(_.range($('.'+deckName+" img").length,deckLength)).each(function(sliden){
      $('<img />').attr('src',deckName+'/'+sliden+'.png') 
                 .addClass('s'+sliden)
                 .hide()
                 .appendTo('.'+deckName);
   });
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
      console.log(deckName,slide);
      $('.'+deckName+' .s'+slide).show();
    }
    $('.'+deckName).click(function(evt){
       deltSlide( evt.pageX<($(window).width()/2)?-1:+1);
        $('.instruct').fadeOut();
    });
  }

  wireDeck('slides',13);
  wireDeck('screens',8);
  
  syncOrientation=function(){
   window.scrollTo(0, 1);
    if(typeof(window.orientation)=="undefined") return;
   var isVert=window.orientation%180==0;
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
  $(window).resize(syncOrientation);
  fakeOrientation=function(deg){
    window.orientation=deg;
    syncOrientation();
  }
});

window.addEventListener('load', function(){
    setTimeout(scrollTo, 0, 0, 1);
  }, false);
