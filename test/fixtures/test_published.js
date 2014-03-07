(function (lib, img, cjs) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 320,
	height: 416,
	fps: 24,
	color: "#FFFFFF",
	manifest: [
		{src:"images/aaa.png", id:"aaa"},
		{src:"images/bbb.png", id:"bbb"}
	]
};

// stage content:
(lib.Untitled = function(mode,startPosition,loop) {
	this.initialize(mode,startPosition,loop,{});

	// timeline functions:
	this.frame_0 = function() {
		var mage = this.moge.cloneWithSharingCache();
		
		
		mage.x = 10;
		
		this.addChild(mage);
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(3));

	// レイヤー 1
	this.instance = new lib.bbb();
	this.instance.setTransform(41,182);

	this.instance_1 = new lib.aaa();
	this.instance_1.setTransform(138,95);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).wait(3));

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(201,303,143,235);


// symbols:
(lib.aaa = function() {
	this.initialize(img.aaa);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,46,79);


(lib.bbb = function() {
	this.initialize(img.bbb);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,109,148);

})(lib = lib||{}, images = images||{}, createjs = createjs||{});
var lib, images, createjs;