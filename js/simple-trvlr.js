$(function(){

  nslides=13;
  isSlides=true;

  wireDeck=function(deckName,deckLength){
   var slide=1;
   $('.'+deckName+' img').click(function(){
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
    if(typeof(window.orientation)=="undefined") return;

   var sel = (window.orientation%180==0)?"slides":"screens";
   $('.slides,.screens').show();
   $('.'+sel).hide();

   window.scrollTo(0, 1);

  }
  window.onorientationchange=syncOrientation;
  syncOrientation();

  fakeOrientation=function(deg){
    window.orientation=deg;
    syncOrientation();
  }
});

window.addEventListener('load', function(){
    setTimeout(scrollTo, 0, 0, 1);
  }, false);
