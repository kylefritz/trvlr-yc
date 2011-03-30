  SlideshowController=Backbone.Controller.extend({
    routes:{
      "":"bootstrap"
      ,"slide/:number":"slide"
      ,"screen/:number":"screen"
    }
    ,bootstrap:function(){
       slideshow.view.orientationChange();
    }
    ,slide:function(number){
       slideshow.set({showing:"slides"})
       slideshow.Slides.set({slide:number});
    }
    ,screen:function(number){
       slideshow.set({showing:"screens"})
       slideshow.Screens.set({slide:number});
    }
  });
Deck = Backbone.Model.extend({
    defaults:{
      length:0
      ,name:""
      ,slide:0
      ,loaded:false
      ,orientation:"horizontal"
    }
    ,initialize:function(){
        this.Slides=new Slides;
        _(_.range(this.get("length"))).each(_.bind(function(n){
          var slide = new Slide({number:n})
          slide.Deck=this;
          var view=new SlideView({model:slide});
          this.Slides.add(slide);
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
    _(this).bindAll('scrollUp','load','render');
    slideshow.bind('change:showing',this.render);
  }
  ,scrollUp:function(){
    window.scrollTo(0, 1);
  }
  ,load:function(){
    if(this.model.get("loaded")) return;

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
    this.model.set({loaded:true});
  }
  ,render:function(){
    if(slideshow.get("showing")==this.model.get("name")){
      $(this.el).show();
      this.load();
    }else{
      $(this.el).hide();
    }
    return this;
  }
});
Slide=Backbone.Model.extend({});
Slides=Backbone.Collection.extend({model:Slide});
SlideView = Backbone.View.extend({
  className:"slide"
  ,initialize:function(){
    this.model.view=this;
    this.model.Deck.bind("change:slide",this.toggleVisible);
    //TODO: not sure this belongs here
    //slideshow.bind("change:orientation",this.resize);
    //$(window).resize(this.resize);
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
    $(this.el).append(
       $('<p>Spacetravlr<br/>loading ('+this.model.get("number")+') ...</p>') 
      );
    var $img=$('<img />').attr({height:this.model.get("height")});
    $img.load(function(){
        $(this.el).html($img);
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
    _(this).bindAll("init");
  }
  ,init:function(){
    this.Slides=new Deck({name:'slides',length:13,width:800,height:600});
    this.SlidesView=new DeckView({model:this.Slides});
    this.Screens=new Deck({name:'screens',length:8,height:418,width:320});
    this.ScreensView=new DeckView({model:this.Screens});

    var view = new SlideshowView({model:this});
    $('body').html(view.render().el);
    //new SlideshowController();
    //Backbone.history.start();
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
    $(this.el).append(this.model.Slides.view.render())
              .append(this.model.Screens.view.render())
    return this;
  }
});

$(function(){
  slideshow=new Slideshow;
  slideshow.init();
});//end document ready


_fakeOrientation=function(deg){
    window.orientation=deg;
    showView.orientationChange();
}

window.addEventListener('load', function(){
    setTimeout(scrollTo, 0, 0, 1);
  }, false);
