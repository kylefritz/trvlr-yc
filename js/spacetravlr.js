$(function(){

jQuery.extend({
        clamp: function (top, bot, val) { return Math.max(bot, Math.min(val, top)); }
})
trvlr={};
trvlr.controller = Backbone.Controller.extend({
  routes:{
    "slide/:num":"slide"
   ,"screen/:num":"screen"
  }
  ,slide:function(num){
   slideshow.setSlide(num);
  }
  ,screen:function(num){
   slideshow.setScreen(num);
  }
})

trvlr.model = Backbone.Model.extend({
  defaults:{
    screenN:1,
    slideN:1,
    nSlides:13,
    nScreens:8,
    mode:"slides"
  }
  , initialize:function(){
		_.bindAll(this,'inc','dec','delt')
    this.syncOrientation();
		var self=this;
  }
  , inc:function(){ this.delt(1); }
  , dec:function(){ this.delt(-1); }
	, delt:function(n){
			if(this.isSlides()){
				this.setSlide(this.get("slideN")+n);
			}else{
				this.setScreen(this.get("screenN")+n);
			}
	}
  , setSlide:function(n){
    this.set({mode:"slides","slideN":$.clamp(this.get("nSlides"),1 , n)})
  }
  , setScreen:function(n){
    this.set({mode:"screens","screenN":$.clamp(this.get("nScreens"),1 , n)})
  }
  , syncOrientation:function(){
    if(typeof(window.orientation)=="undefined") return;
    // phone rotated
    window.slideshow.set({mode:window.orientation==0?"screens":"slides"});
  }
	, isSlides:function(){
		return this.get("mode")=="slides";
	}
})

trvlr.view = Backbone.View.extend({
  className:"slideshow"
  , events:{
     "click .slides img"  : "next"
    , "click .screens img" : "next"
  }
  , initialize:function(){
    _(this).bindAll("render","next","keydown");
    this.model.bind("change",this.syncSlides);
    this.delegateEvents(this.events);
    $(document).keydown(this.keydown);
  }
  , next:function(){
    console.log('next');
    this.model.inc();
	}
  , keydown:function(event){
    console.log(event);
    if (event.keyCode == 32) {
        this.inc();
    } else if (event.keyCode == 37) {
        this.dec(); //left
    } else if (event.keyCode == 39) {
        this.inc(); //right
    }
  }
  , syncSlides:function(){
    console.log('render');
		if(this.model.isSlides()){
			$('.screens').hide();

			$('.slides').show();
	    $('.slides img').hide();
	    var id='.slides .s'+this.model.get("slideN");
	    $(id).show();
			console.log(id);
		}else{
			$('.slides').hide();

			$('.screens').show();
	    $('.screens img').hide();
	    var id='.screens .s'+this.model.get("screenN");
	    $(id).show();
			console.log(id);
		}
  }
})

  window.slideshow = new trvlr.model();
  view = new trvlr.view({model:slideshow});
  new trvlr.controller();
  Backbone.history.start();
  window.onorientationchange = slideshow.syncOrientation; 

});
