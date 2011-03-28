$(function(){
  SlideshowController=Backbone.Controller.extend({
    routes:{
      "":"bootstrap"
      ,"slide/:number":"slide"
      ,"screen/:number":"screen"
    }
    ,bootstrap:function(){
        showView.orientationChange();
    }
    ,slide:function(number){
       $(slideshow.Screens.view.el).hide();
       $(slideshow.Slides.view.el).show();
       slideshow.Slides.set({slide:number});
    }
    ,screen:function(number){
       $(slideshow.Slides.view.el).hide();
       $(slideshow.Screens.view.el).show();
       slideshow.Screens.set({slide:number});
    }
  });
Deck = Backbone.Model.extend({
    defaults:{
      length:0
      ,name:""
      ,slide:0
    }
    ,initialize:function(){
        this.Slides=new Slides;
        _(_.range(this.get("length"))).each(_.bind(function(n){
          //var slide=new SlideView({model:
          //  new Slide({number:n,Deck:this})
          //});
          //this.Slides.add(slide);
        },this));
    }
    , deltSlide:function(n){
        window.scrollTo(0, 1);
        var length=this.get('length');
        slide+=d;
        if(slide>=length){
          slide=0;
        }
        if(slide<0){
          slide=length-1;
        }
        this.set({slide:slide});
    }
   });
DeckView=Backbone.View.extend({
  events:{
    "click":"changeSlide"
  }
  ,initialize:function(){
    this.model.view=this;
    this.model.bind("change:slide",this.scrollUp);
    this.className=this.model.get("name");
    _(this).bindAll('scrollUp','render');
  }
  ,scrollUp:function(){
    window.scrollTo(0, 1);
  }
  ,render:function(){
    this.model.Slides.each(function(slide){
      $(this.el).append(slide.view.render().el);
    });
    $(this.el)
      .addSwipeEvents()
      .bind('swipeleft',_.bind(function(){this.model.deltSlide(+1)},this))
      .bind('swiperight',_.bind(function(){this.model.deltSlide(-1)},this))
      .click(_.bind(function(evt){
        this.model.deltSlide( evt.pageX<($(window).width()/2)?-1:+1);
      },this));
  }
});
Slide = Backbone.Model.extend({});
Slides = Backbone.Collection.extend({
  model:Slide
});
SlideView = Backbone.View.extend({
  className:"slide"
  ,initialize:function(){
    this.model.Deck.bind("change:slide",this.toggleVisible);
    this.model.Deck.Slideshow.bind("change:orientation",this.resize);
    $(window).resize(this.resize);
    _(this).bindAll('toggleVisible','resize','render');
  }
  ,toggleVisible:function(){
    if(this.model.Deck.get("slide")==this.model.get("number")){
      $(this.el).show();
    }else{
      $(this.el).hide();
    }
  }
  ,resize:function(){
     var targetH=0;
     if(navigator.userAgent.match(/iphone/i)){
        targetH=isVert?416:268;
     }else{
        targetH=$('body').height();
     }
     this.$('img').css({height:targetH});
  }
  ,render:function(){
    $(this).append(
       $('<p>Spacetravlr<br/>loading ('+this.model.get("number")+') ...</p>') 
      );
    var $img=$('<img />').attr({height:this.model.get("height")});
    $img.load(function(){
        $(this).html($img);
        this.model.set({loaded:true});
      }).attr('src',op.deckName+'/'+sliden+'.png');
    return this;
  }
}); 
Slideshow=Backbone.Model.extend({
  defaults:{
    orientation:"horizontal"
  }
  ,initialize:function(){
    this.Slides=new Deck({name:'slides',length:13,width:800,height:600});
    this.Slides.Slideshow=this;
    this.SlidesView=new DeckView({model:this.Slides});
    this.Screens=new Deck({name:'screens',length:8,height:418,width:320});
    this.Screens.Slideshow=this;
    this.ScreensView=new DeckView({model:this.Screens});
    //todo: create views also
  }
});
SlideshowView=Backbone.View.extend({
  className:"slideshow"
  ,initialize:function(){
    window.onorientationchange=this.orientationChange;
    $(window).resize(_.bind(this.orientationChange,this));
    _(this).bindAll("orientationChange","render");
    this.model.view=this;
  }
  , orientationChange:function(){
     window.scrollTo(0, 1);
     var orientation= (typeof(window.orientation)=="undefined"
                        || window.orientation%180!=0)
                      ? "horizontal"
                      : "vertical";
     this.model.set({orientation:orientation});
     if(orientation=="horizontal"){
       window.location="#slide/"+this.model.Slides.get('slide');;
     }else{
       window.location="#screens/"+this.model.Screens.get('slide');
     }
  }
  , render:function(){
    $(this.el).append(this.Slides.view.render())
              .append(this.Screens.view.render())
    return this;
  }
});

slideshow=new Slideshow;
showView=new SlideshowView({model:slideshow});
//$('theShow').append(theShow.render().el);
controller=new SlideshowController();
Backbone.history.start();

});//end document ready


_fakeOrientation=function(deg){
    window.orientation=deg;
    showView.orientationChange();
}

window.addEventListener('load', function(){
    setTimeout(scrollTo, 0, 0, 1);
  }, false);
