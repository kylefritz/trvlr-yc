$(function(){
  slides={deckName:'slides',deckLength:13,width:800,height:600};
  screens={deckName:'screens',deckLength:8,height:418,width:320};
  
  deck = Backbone.Model.extend({
    initialize:function(){
    }
    , load:function(){
      var name=this.get('deckName');
      var length=this.get('deckLength');
      _(_.range($('.'+name+" img").length,length)).each(
       function(sliden){
         var $holder = $('<div ><p>Spacetravlr<br/>loading ('+sliden+') ...</p></div>')
                           .addClass('s'+sliden)
                           .appendTo('.'+name);
          var $img=$('<img />').attr({height:op.height});
          $img.load(function(){
                 $holder.html($img.get(0));
                    if(op.deckName=="screens"&&sliden==op.deckLength-1){
                      //todo this should be a callback
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

      //wire
      this.deltSlide(0);
      $('.'+name).click(_.bind(function(evt){
         this.deltSlide( evt.pageX<($(window).width()/2)?-1:+1);
      },this))
        .addSwipeEvents()
        .bind('swipeleft',_.bind(function(){this.deltSlide(+1)},this))
        .bind('swiperight',_.bind(function(){this.deltSlide(-1)},this));
    }
    , deltSlide:function(n){
        window.scrollTo(0, 1);
        var length=this.get('deckLength');
        slide+=d;
        if(slide>=length){
          slide=0;
        }
        if(slide<0){
          slide=length-1;
        }
    
        this.set({slide:slide});
        this.setSlide();
    }
    , setSlide:function(){
        var slide=this.get("slide");
        var name=this.get('deckName');
   
        //hide all
        $('.'+name+' > div').hide();
        $('.'+name+' .s'+slide).show();
        if(slide>0){
          $('.instruct').fadeOut();
        }
    }
   });

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
 
  $(window).resize(syncOrientation);

  fakeOrientation=function(deg){
    window.orientation=deg;
    syncOrientation();
  }
});

window.addEventListener('load', function(){
    setTimeout(scrollTo, 0, 0, 1);
  }, false);
