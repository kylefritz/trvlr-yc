SlideshowController=Backbone.Controller.extend({
  routes:{
    "":"bootstrap"
    ,"slides/:number":"slide"
    ,"screens/:number":"screen"
  }
  ,bootstrap:function(){
     slideshow.view.orientationChange();
  }
  ,slide:function(number){
     slideshow.set({showing:"slides"})
     slideshow.Slides.set({slide:parseInt(number)});
  }
  ,screen:function(number){
     slideshow.set({showing:"screens"})
     slideshow.Screens.set({slide:parseInt(number)});
  }
});
Deck = Backbone.Model.extend({
    defaults:{
      length:0
      ,name:""
      ,slide:0
      ,loaded:false
      ,orientation:"horizontal"
      ,nSlidesLoaded:0
      ,allLoaded:false
    }
    ,initialize:function(){
        _(this).bindAll("deltSlide","slideLoaded");
        this.Slides=new Slides;
        _(_.range(this.get("length"))).each(_.bind(function(n){
          var slide = new Slide({number:n});
          slide.Deck=this;
          slide.bind('change:loaded',this.slideLoaded);
          var view=new SlideView({model:slide});
          this.Slides.add(slide);
        },this));
    }
    , slideLoaded:function(){
      var nloaded=this.get("nSlidesLoaded")+1
      this.set({nSlidesLoaded:nloaded});
      if(nloaded==this.get("length")){
        this.set({allLoaded:true});
      }
    }
    , deltSlide:function(n){
        var length=this.get('length');
        var slide=this.get('slide');
        slide+=n;
        if(slide>=length){
          slide=0;
        }
        if(slide<0){
          slide=length-1;
        }
        this.set({slide:slide})
        window.location='#'+this.get('name')+'/'+slide;
    }
   });
DeckView=Backbone.View.extend({
  className:"deck"
  , events:{
  }
  ,initialize:function(){
    this.model.view=this;
    this.model.bind("change:slide",this.scrollUp);
    _(this).bindAll('scrollUp','load','render');
    slideshow.bind('change:showing',this.render);
  }
  ,scrollUp:function(){
    window.scrollTo(0, 1);
  }
  ,load:function(){
    if(this.model.get("loaded")) return;

    this.model.Slides.each(_.bind(function(slide){
      $(this.el).append(slide.view.render().el);
    },this));

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
    $(this.el).addClass(this.model.get("name"));
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
    _(this).bindAll('toggleVisible','resize','render');
    this.model.Deck.bind("change:slide",this.toggleVisible);
    slideshow.bind("change:orientation",this.resize);
    $(window).resize(this.resize);
  }
  ,toggleVisible:function(){
    if(this.model.Deck.get("slide")==this.model.get("number")){
      $(this.el).show();
      this.resize();
    }else{
      $(this.el).hide();
    }
  }
  ,resize:function(){
    if(this.model.Deck.get("slide")==this.model.get("number")){
     var targetH=0;
     if(navigator.userAgent.match(/iphone/i)){
        var H=slideshow.get("orientation")=="vertical"?416:268;
        this.$('img').css({height:H});
     }else{
       var imgH=this.model.Deck.get('height');
       var targetH=Math.min(imgH*1,$(window).height());
       var sf=(targetH/imgH);
       var targetW=sf*this.model.Deck.get('width'); 
       var windowW=$(window).width();
       //check won't be wider than window
       if(targetW<windowW){
         var cssUpdate={height:targetH,width:""};
       }else{
         var cssUpdate={width:windowW-20,height:""};
       }
       this.$('img').css(cssUpdate);
     }
    }
  }
  ,render:function(){
    $(this.el).append(
       $('<p>Spacetravlr<br/>loading ('+this.model.get("number")+') ...</p>') 
      );
    var $img=$('<img />').attr({height:this.model.get("height")});
    var src=this.model.Deck.get("name")+
            '/'+this.model.get("number")+
            '.png';
    $img.load(_.bind(function(){
        $(this.el).html($img);
        this.model.set({loaded:true});
        this.toggleVisible();
        this.resize();
      },this)).attr('src',src);

    this.toggleVisible();
    return this;
  }
}); 
InstructionsView=Backbone.View.extend({
  className:"instruct"
  ,initialize:function(){
    _(this).bindAll("render",'updateVisible');
    this.model.bind('change:showing',this.updateVisible);
    this.model.Slides.bind('change:slide',this.updateVisible);
  }
  ,updateVisible:function(){
    if(this.model.Slides.get("slide")==0
      && this.model.get("showing")=="slides"){
        $(this.el).show();
    }else{
        $(this.el).hide();
    }
  }
  ,render:function(){
      if(!navigator.userAgent.match(/iphone|android/i)){
      $(this.el).html("<p>click to the right to advance</p>"+
        "<p>use mobile device to see product screens</p>");
      }
      this.updateVisible();
      return this;
  }
})
Slideshow=Backbone.Model.extend({
  defaults:{
    orientation:"horizontal"
    , showing:"neither"
  }
  ,initialize:function(){
    _(this).bindAll("init");
  }
  ,init:function(){
    this.Slides=new Deck({name:'slides',length:13,width:800,height:600});
    this.SlidesView=new DeckView({model:this.Slides});
    this.Screens=new Deck({name:'screens',length:8,height:418,width:320});
    this.ScreensView=new DeckView({model:this.Screens});

    //wire together
    this.Slides.bind('change:allLoaded',_.bind(function(){this.ScreensView.load()},this));
    this.Screens.bind('change:allLoaded',_.bind(function(){this.SlidesView.load()},this));

    this.Instructions=new InstructionsView({model:this});

    var view = new SlideshowView({model:this});
    $('body').html(view.render().el);
    new SlideshowController();
    Backbone.history.start();
  }
});
SlideshowView=Backbone.View.extend({
  className:"slideshow"
  ,initialize:function(){
    window.onorientationchange=_.bind(this.orientationChange,this);
    _(this).bindAll("parseOrientation","orientationChange","render");
    this.model.view=this;
    this.parseOrientation();
  }
  , parseOrientation:function(){
    var orientation= (typeof(window.orientation)=="undefined"
                        || window.orientation%180!=0)
                      ? "horizontal"
                      : "vertical";
     this.model.set({orientation:orientation});
  }
  , orientationChange:function(){
     this.parseOrientation();
     if(this.model.get("orientation")=="horizontal"){
       window.location="#slides/"+this.model.Slides.get('slide');;
       window.scrollTo(0, 1);
     }else{
       window.location="#screens/"+this.model.Screens.get('slide');
       setTimeout(scrollTo, 0, 0, 1);
     }
  }
  , render:function(){
    $(this.el).append(this.model.Slides.view.render().el)
              .append(this.model.Screens.view.render().el)
              .append(this.model.Instructions.render().el)
    return this;
  }
});

$(function(){
  slideshow=new Slideshow;
  slideshow.init();
});//end document ready


_fakeOrientation=function(deg){
    window.orientation=deg;
    slideshow.view.orientationChange();
}

window.addEventListener('load', function(){
    setTimeout(scrollTo, 0, 0, 1);
  }, false);
