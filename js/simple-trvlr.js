$(function(){

  nslides=13;
  isSlides=true;

  wireDeck=function(deckName,deckLength){
   var slide=1;
   $('.'+deckName+' img').click(function(){
      window.scrollTo(0, 1);

      $('.'+deckName+' .s'+slide).hide();
      slide++;
      if(slide>deckLength){
        slide=1;
      }
      $('.'+deckName+' .s'+slide).show();
    }); 
  }
  wireDeck('slides',13);//its one indexed
  wireDeck('screens',7);
  
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
