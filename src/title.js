// title.js

var play_label;
var play_labelBox;
var play_flg = false;

var title = cc.Layer.extend({
  ctor: function(){
    this._super();
    var size = cc.director.getWinSize();

    var title_back = new cc.Sprite(res.bg_back_png);
    title_back.setPosition(cc.p(size.width * 0.5, size.height * 0.5));
    title_back.setScale(title_back.getScale(), cc.director.getWinSize().height / title_back.getContentSize().height);
    var title_back_layer = cc.Layer.create();
    title_back_layer.addChild(title_back);
    this.addChild(title_back_layer);

    var title_label = new cc.Sprite(res.title_png);
    title_label.setPosition(cc.p(size.width * 0.5, size.height * 0.6));
    var title_label_layer = cc.Layer.create();
    title_label_layer.addChild(title_label);
    this.addChild(title_label_layer);

    var sparkle_frames = new cc.Sprite(res.sparkle_frames_png);
    sparkle_frames.setPosition(cc.p(size.width * 0.35, size.height * 0.47));
    var sparkle_frames2 = new cc.Sprite(res.sparkle_frames_png);
    sparkle_frames2.setPosition(cc.p(size.width * 0.72, size.height * 0.67));
    var sparkle_frames_layer = cc.Layer.create();
    sparkle_frames_layer.addChild(sparkle_frames);
    sparkle_frames_layer.addChild(sparkle_frames2);
    this.addChild(sparkle_frames_layer);

    play_label = new cc.Sprite(res.playbutton_png);
    play_label.setPosition(size.width * 0.5, size.height * 0.25);
    var play_label_layer = cc.Layer.create();
    play_label_layer.addChild(play_label);
    this.addChild(play_label_layer);

    // タップイベントリスナー登録
    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: this.onTouchBegan,
      onTouchMoved: this.onTouchMoved,
      onTouchEnded: this.onTouchEnded
    }, this);
    return true;
  },
  onTouchBegan: function(touch, event){
    play_labelBox = play_label.getBoundingBox();

    if (cc.rectContainsPoint(play_labelBox, touch.getLocation())){
      play_label.setOpacity(120);
      play_flg = true;
    }
    return true;},
  onTouchMoved: function(touch, event){},
  onTouchEnded: function(touch, event){
    if (play_flg) {
      var cheng_scene = cc.TransitionFade.create(1, new gameScene());
      cc.director.runScene(cheng_scene);
      play_label.setOpacity(255);
      play_flg = false;
    }
  }
});

//パーティクル用のレイヤー
var particleLayer = cc.Layer.extend({

  ctor: function() {
    this._super();
    size = cc.winSize;
    this.scheduleUpdate();
    return true;
  },
  update: function(_dt) {
     this.Particle();
  },
  Particle: function() {
      var tempParticle = new cc.ParticleSystem(res.particle_dot_png);
      tempParticle.setPosition(size.width * 0.5, size.height * 0.6);
      //tempParticle.setDuration(5);
      this.addChild(tempParticle, 20);
      //tempParticle.setAutoRemoveOnFinish(true);
  }
});

var titleScene = cc.Scene.extend({
  onEnter: function(){
    this._super();

    var titlelayer = new title();
    this.addChild(titlelayer);
    //var particleayer = new particleLayer();
    //this.addChild(particleayer);
  }
});
