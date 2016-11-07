var HoverHeight = 300; //ホバリング
var RiseHeight = 240; //Rise上昇

var enemyBat1;
var enemyBat2;
var enemyZon;
var enemysl1;
var enemysl2;
var enemysl3;
var enemysl4;

var enemyLayer = cc.Layer.extend({
   ctor: function() {
      this._super();
      enemyBat1 = new EnemyBat(800, 700);
      enemyBat2 = new EnemyBat(100, 700);
      enemyZon = new en_zon();
      enemysl1 = new en_gsl(850, 100);
      enemysl2 = new en_gsl(150, 100);
      enemysl3 = new en_rsl(700, 100);
      enemysl4 = new en_ysl(300, 100);

      this.addChild(enemyBat1);
      this.addChild(enemyBat2);
      this.addChild(enemyZon);
      this.addChild(enemysl1);
      this.addChild(enemysl2);
      this.addChild(enemysl3);
      this.addChild(enemysl4);
      //cc.eventManager.addListener(listener, this);
   }
});
var EnemyBat = cc.Sprite.extend({
  ctor: function(x, y) {
    this._super();
    this.initWithFile(res.bat_frames_png);
    this.velocity = cc.p(0, 0);
    this.FrameCount = 0;
    this.setPosition(x, y);

    var animationframe = [];
    //スプライトフレームを格納する配列
    var texture = cc.textureCache.addImage(res.bat_frames_png);
    for (i = 0; i < 2; i++) {
      for (j = 0; j < 2; j++) {
        //スプライトフレームを作成
        var frame = new cc.SpriteFrame.createWithTexture(texture, cc.rect(160 * j, 96 * i, 160, 96));
        //スプライトフレームを配列に登録
        animationframe.push(frame);
      }
    }
    //スプライトフレームの配列を連続再生するアニメーションの定義
    var animation = new cc.Animation(animationframe, 0.08);
    //永久ループのアクションを定義
    var action = new cc.RepeatForever(new cc.animate(animation));
    //実行
    this.runAction(action);
    this.scheduleUpdate();
  },
  update: function(dt) {
    this.FrameCount++;
    //4フレームに1回　こうもりの移動計算する
    if (this.FrameCount % 4 == 0) {
      //プレイヤーの位置をこうもりの位置の差を計算
      var offset_x = player.getPosition().x - this.getPosition().x;
      var offset_y = player.getPosition().y - this.getPosition().y;
      //offset_x = offset_x*Math.sin(offset_x);
      //蝙蝠のｘ移動速度をプレイヤとこうもりの間の距離の0.05倍にする
      var velocity_x = lerp(this.velocity.x, offset_x, 0.005);
      var velocity_y = this.velocity.y;
      //フォバリング高度より上なら下降させる。　降下下限高度より下にいたら、上昇させる
      if (this.getPosition().y > HoverHeight) velocity_y += -0.035;
      if (this.getPosition().y < RiseHeight) velocity_y += 0.05;
      //プレイヤーの位置よりできるだけ下にならないように
      if (this.getPosition().y < player.y + 20) velocity_y += 0.05;
      //8の字旋回軌道をsin計算で適当に補正
      velocity_y += 0.075 * Math.sin(this.FrameCount * 0.015) * Math.sin(this.FrameCount * 0.04);
      //console.log(velocity_x, velocity_y);
      this.velocity.x = velocity_x;
      this.velocity.y = velocity_y;
      //  console.log(MoveDirection, this.velocity.x, offset.x);
      if (this.velocity.x <= 0)
        this.setFlippedX(true);
      if (this.velocity.x > 0)
        this.setFlippedX(false);
      this.setPosition(this.getPosition().x + this.velocity.x, this.getPosition().y + this.velocity.y);
    }
  }
});
//始点、終点、の間で 0～1.0の割合の位置を返す関数
function lerp(fStart, fEnd, fPercent) {
  return fStart + ((fEnd - fStart) * fPercent);
}

var en_zon = cc.Sprite.extend({
  ctor: function(){
    this._super();
    this.initWithFile(res.zombie_frames_png);
    this.setPosition(990, 130);
    var animationframe = [];
    //スプライトフレームを格納する配列
    var texture = cc.textureCache.addImage(res.zombie_frames_png);
    for (i = 0; i < 2; i++) {
      for (j = 0; j < 4; j++) {
        //スプライトフレームを作成
        var frame = new cc.SpriteFrame.createWithTexture(texture, cc.rect(128 * j, 128 * i, 128, 128));
        //スプライトフレームを配列に登録
        animationframe.push(frame);
      }
    }
    //スプライトフレームの配列を連続再生するアニメーションの定義
    var animation = new cc.Animation(animationframe, 0.08);
    //永久ループのアクションを定義
    var action = new cc.RepeatForever(new cc.animate(animation));
    //実行
    this.runAction(action);
    this.scheduleUpdate();
  },
  update: function(){
    var offset_x = player.getPosition().x - this.getPosition().x;
    if (offset_x != 0) {
      if (offset_x > 0) {
        this.setFlippedX(false);
        this.setPosition(this.getPositionX() + 0.5, this.getPositionY());
      }
      if (offset_x < 0) {
        this.setFlippedX(true);
        this.setPosition(this.getPositionX() - 0.5, this.getPositionY());
      }
    }
  }
});

var en_gsl = cc.Sprite.extend({
  ctor: function(x, y){
    this._super();
    this.initWithFile(res.slime_green_frames_png);
    this.setPosition(x, y);
    var animationframe = [];
    //スプライトフレームを格納する配列
    var texture = cc.textureCache.addImage(res.slime_green_frames_png);
    for (i = 0; i < 4; i++) {
      for (j = 0; j < 4; j++) {
        //スプライトフレームを作成
        var frame = new cc.SpriteFrame.createWithTexture(texture, cc.rect(128 * j, 64 * i, 128, 64));
        //スプライトフレームを配列に登録
        animationframe.push(frame);
      }
    }
    //スプライトフレームの配列を連続再生するアニメーションの定義
    var animation = new cc.Animation(animationframe, 0.08);
    //永久ループのアクションを定義
    var action = new cc.RepeatForever(new cc.animate(animation));
    //実行
    this.runAction(action);
    this.scheduleUpdate();
  },
  update: function(){
    var offset_x = player.getPosition().x - this.getPosition().x;
    if (offset_x != 0) {
      if (offset_x > 0) {
        this.setFlippedX(false);
        this.setPosition(this.getPositionX() + 0.5, this.getPositionY());
      }
      if (offset_x < 0) {
        this.setFlippedX(true);
        this.setPosition(this.getPositionX() - 0.5, this.getPositionY());
      }
    }
  }
});

var en_ysl = cc.Sprite.extend({
  ctor: function(x, y){
    this._super();
    this.initWithFile(res.slime_red_frames_png);
    this.setPosition(x, y);
    var animationframe = [];
    //スプライトフレームを格納する配列
    var texture = cc.textureCache.addImage(res.slime_red_frames_png);
    for (i = 0; i < 3; i++) {
      for (j = 0; j < 4; j++) {
        //スプライトフレームを作成
        var frame = new cc.SpriteFrame.createWithTexture(texture, cc.rect(128 * j, 64 * i, 128, 64));
        //スプライトフレームを配列に登録
        animationframe.push(frame);
      }
    }
    //スプライトフレームの配列を連続再生するアニメーションの定義
    var animation = new cc.Animation(animationframe, 0.08);
    //永久ループのアクションを定義
    var action = new cc.RepeatForever(new cc.animate(animation));
    //実行
    this.runAction(action);
    this.scheduleUpdate();
  },
  update: function(){
    var offset_x = player.getPosition().x - this.getPosition().x;
    if (offset_x != 0) {
      if (offset_x > 0) {
        this.setFlippedX(false);
        this.setPosition(this.getPositionX() + 0.5, this.getPositionY());
      }
      if (offset_x < 0) {
        this.setFlippedX(true);
        this.setPosition(this.getPositionX() - 0.5, this.getPositionY());
      }
    }
  }
});

var en_rsl = cc.Sprite.extend({
  ctor: function(x, y){
    this._super();
    this.initWithFile(res.slime_red_frames_png);
    this.setPosition(x, y);
    var animationframe = [];
    //スプライトフレームを格納する配列
    var texture = cc.textureCache.addImage(res.slime_red_frames_png);
    for (i = 3; i < 6; i++) {
      for (j = 0; j < 4; j++) {
        //スプライトフレームを作成
        var frame = new cc.SpriteFrame.createWithTexture(texture, cc.rect(128 * j, 64 * i, 128, 64));
        //スプライトフレームを配列に登録
        animationframe.push(frame);
      }
    }
    //スプライトフレームの配列を連続再生するアニメーションの定義
    var animation = new cc.Animation(animationframe, 0.08);
    //永久ループのアクションを定義
    var action = new cc.RepeatForever(new cc.animate(animation));
    //実行
    this.runAction(action);
    this.scheduleUpdate();
  },
  update: function(){
    var offset_x = player.getPosition().x - this.getPosition().x;
    if (offset_x != 0) {
      if (offset_x > 0) {
        this.setFlippedX(false);
        this.setPosition(this.getPositionX() + 0.5, this.getPositionY());
      }
      if (offset_x < 0) {
        this.setFlippedX(true);
        this.setPosition(this.getPositionX() - 0.5, this.getPositionY());
      }
    }
  }
});
