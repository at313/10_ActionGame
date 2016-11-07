var size;
//1:地面　2:ブロック　3:プレイヤ　4:ゾンビ 5:こうもり
var level = [
   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
   [0, 0, 0, 2, 2, 2, 0, 0, 0, 0],
   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
var curtain_right;
var curtain_left;
var tileSize = 96;
var playerPosition; //マップ内のプレイやの位置(ｘ、ｙ)を保持する
var playerSprite; //プレイヤーのスプライト
var leftBtn; //左ボタン
var rightBtn; //右ボタン
var jumpBtn; //ジャンプ
var winSize;

var score = 0;
var scorelabel;

// アニメーションフレーム一覧
// 待機
var Idol_Animation = [];
// 歩行
var Walk_Animation = [];
// 攻撃
var Atack_Animation = [];
// ジャンプ
var Junp_Animation = [];
// ジャンプアタック
var JunpAtack_Animation = [];
// 落下
var Fall_Animation = [];

// 各アクション用変数
var action_I;
var action_W;
var action_A;
var action_J;
var action_JA;
var action_F;

var gameScene = cc.Scene.extend({
   onEnter: function() {
      this._super();

      winSize = cc.director.getWinSize();

      var background = new backgroundLayer();
      this.addChild(background);
      var level = new levelLayer();
      this.addChild(level);
      var panel_layer = new panel_Layer();
      this.addChild(panel_layer);
      var curtain = new curtain_Layer();
      this.addChild(curtain);
      var player = new playerLayer();
      this.addChild(player);
      var enemys = new enemyLayer();
      this.addChild(enemys);
      var coin = new coinLayer();
      this.addChild(coin);
   }
});


var backgroundLayer = cc.Layer.extend({
   ctor: function() {
      this._super();
      // 背景
      var bg_backSprite = cc.Sprite.create(res.bg_back_png);
      var size = bg_backSprite.getContentSize();
      this.addChild(bg_backSprite);
      bg_backSprite.setPosition(winSize.width * 0.5, winSize.height * 0.5);
      //背景画像を画面の大きさに合わせるためのScaling処理
      bg_backSprite.setScale(bg_backSprite.getScale(), winSize.height / size.height);

      // 地面
      var bg_frontSprite = cc.Sprite.create(res.bg_front_png);
      this.addChild(bg_frontSprite);
      bg_frontSprite.setPosition(winSize.width * 0.5, winSize.height * 0.2);

      // ライト
      var bg_light = cc.Sprite.create(res.bg_light);
      this.addChild(bg_light);
      bg_light.setPosition(winSize.width * 0.5, winSize.height * 0.5);
      //背景画像を画面の大きさに合わせるためのScaling処理
      bg_light.setScale(bg_light.getScale(), winSize.height / size.height);
      bg_light.setOpacity(120);
   }
});

var curtain_Layer = cc.Layer.extend({
  ctor: function(){
    this._super();
    // カーテン
    var curtain_right = cc.Sprite.create(res.curtain_png);
    curtain_right.setFlippedX(true);
    curtain_right.setPosition(winSize.width * 0.9, winSize.height * 0.5);
    curtain_right.setScale(curtain_right.getScale(), winSize.height / curtain_right.getContentSize().height);
    this.addChild(curtain_right);
    var curtain_left = cc.Sprite.create(res.curtain_png);
    curtain_left.setPosition(winSize.width * 0.1, winSize.height * 0.5);
    curtain_left.setScale(curtain_right.getScale(), winSize.height / curtain_right.getContentSize().height);
    this.addChild(curtain_left);
  }
});
var gage = [];
var panel_Layer = cc.Layer.extend({
  ctor: function(){
    this._super();
    var texture = cc.textureCache.addImage(res.ui_gauge_fill_png);
    for (var i = 0; i < 3; i++) {
      var frame = new cc.SpriteFrame.createWithTexture(texture, cc.rect(0, 48 * i, 200, 48));
      //スプライトフレームを配列に登録
      gage[i] = frame;
    }
    // ゲージパネル
    var gage1 = cc.Sprite.create(gage[2]);
    this.addChild(gage1);
    gage1.setPosition(winSize.width * 0.24, winSize.height * 0.77);
    gage1.setScale(0.8);
    var gage2 = cc.Sprite.create(gage[2]);
    this.addChild(gage2);
    gage2.setPosition(winSize.width * 0.51, winSize.height * 0.77);
    gage2.setScale(0.8);
    var gage3 = cc.Sprite.create(gage[0]);
    this.addChild(gage3);
    gage3.setPosition(winSize.width * 0.24, winSize.height * 0.77);
    gage3.setScale(0.8);
    var gage4 = cc.Sprite.create(gage[1]);
    this.addChild(gage4);
    gage4.setPosition(winSize.width * 0.51, winSize.height * 0.77);
    gage4.setScale(0.8);

    var panel = cc.Sprite.create(res.ui_panels_png);
    this.addChild(panel);
    panel.setPosition(winSize.width * 0.5, winSize.height * 0.95);
    panel.setScale(0.8);
  }
});


var levelLayer = cc.Layer.extend({
   ctor: function() {
      this._super();
      var size = cc.director.getWinSize();
      for (i = 0; i < 7; i++) {　　　　　　
         for (j = 0; j < 10; j++) {
            switch (level[i][j]) {
               case 1:
                  break;
               case 2:
                  var blockSprite = cc.Sprite.create(res.block_png);
                  blockSprite.setPosition(tileSize / 2 + tileSize * j, 96 * (7 - i));
                  this.addChild(blockSprite);
                  break;
            }
         }
      }
   }
});

var player;
var playerLayer = cc.Layer.extend({
   ctor: function() {
      this._super();
      player = new Player();
      this.addChild(player);

      cc.eventManager.addListener(keylistener, this);
   }
});

var Player = cc.Sprite.extend({
   ctor: function() {
      this._super();
      this.atackFlg = false;
      this.workingFlag = false;
      this.jumpFlag = false;
      this.junpatackFlg = false;
      this.fallFlg = false;
      this.xSpeed = 0;
      this.ySpeed = 0;
      this.setPosition(500, 153);
      // スプライトシートをキャッシュに登録
      cc.spriteFrameCache.addSpriteFrames(res.player_plist, res.sir_awesome_frames_png);

      // スプライトフレームを取得
      var frame0 = cc.spriteFrameCache.getSpriteFrame("player00");
      var frame1 = cc.spriteFrameCache.getSpriteFrame("player01");
      var frame2 = cc.spriteFrameCache.getSpriteFrame("player02");
      var frame3 = cc.spriteFrameCache.getSpriteFrame("player03");
      var frame4 = cc.spriteFrameCache.getSpriteFrame("player04");
      var frame5 = cc.spriteFrameCache.getSpriteFrame("player05");
      var frame6 = cc.spriteFrameCache.getSpriteFrame("player06");
      var frame7 = cc.spriteFrameCache.getSpriteFrame("player07");
      var frame8 = cc.spriteFrameCache.getSpriteFrame("player08");
      var frame9 = cc.spriteFrameCache.getSpriteFrame("player09");
      var frame10 = cc.spriteFrameCache.getSpriteFrame("player10");
      var frame11 = cc.spriteFrameCache.getSpriteFrame("player11");
      var frame12 = cc.spriteFrameCache.getSpriteFrame("player12");
      var frame13 = cc.spriteFrameCache.getSpriteFrame("player13");

      // 待機モーション設定
      Idol_Animation.push(frame4);
      Idol_Animation.push(frame5);
      // 歩行モーション設定
      Walk_Animation.push(frame0);
      Walk_Animation.push(frame1);
      Walk_Animation.push(frame2);
      Walk_Animation.push(frame3);
      Walk_Animation.push(frame4);
      // 攻撃モーション設定
      Atack_Animation.push(frame5);
      Atack_Animation.push(frame6);
      Atack_Animation.push(frame7);
      // ジャンプモーション設定
      Junp_Animation.push(frame8);
      Junp_Animation.push(frame9);
      Junp_Animation.push(frame10);
      // ジャンプ攻撃モーション設定
      JunpAtack_Animation.push(frame11);
      JunpAtack_Animation.push(frame12);
      JunpAtack_Animation.push(frame13);
      // 落下モーション設定
      Fall_Animation.push(frame9);
      Fall_Animation.push(frame10);

      //実行
      this.initWithFile(res.sir_awesome_frames_png);

      //各アニメーションの定義
      var animation1 = new cc.Animation(Idol_Animation, 0.3);
      var animation2 = new cc.Animation(Walk_Animation, 0.06);
      var animation3 = new cc.Animation(Atack_Animation, 0.06);
      var animation4 = new cc.Animation(Junp_Animation, 0.2);
      var animation5 = new cc.Animation(JunpAtack_Animation, 0.06);
      var animation6 = new cc.Animation(Fall_Animation, 0.3);
      //各アクションを定義
      action_I = new cc.RepeatForever(new cc.animate(animation1));
      action_W = new cc.RepeatForever(new cc.animate(animation2));
      action_A = new cc.RepeatForever(new cc.animate(animation3));
      action_J = new cc.animate(animation4);
      action_JA = new cc.animate(animation5);
      action_F = new cc.animate(animation6);
      this.runAction(action_I);

      this.scheduleUpdate();
   },


   //移動のため
   update: function(dt) {
      if (this.xSpeed > 0) { //スピードが正の値（右方向移動）
         //　向きを判定させる
         this.setFlippedX(false);
      }
      if (this.xSpeed < 0) { //スピードが負の値（左方向移動）
         this.setFlippedX(true);
      }
      //プレイヤーを降下させる処理　ジャンプボタンが押されてないときで、プレイヤが空中にある場合
      if (this.jumpFlag == false) {
         if (this.getPosition().y < 130 ) {
           this.ySpeed = 0;
           this.fallFlg = false;
         }
         else {
           this.fallFlg = true;
           this.ySpeed = this.ySpeed - 0.5;
         }
      }
      //位置を更新する
      this.setPosition(this.getPosition().x + this.xSpeed, this.getPosition().y + this.ySpeed);

   }

});

var coinLayer = cc.Layer.extend({
   ctor: function() {
      this._super();
      var coin1 = new Coin1(336, 241);
      this.addChild(coin1);
      var coin2 = new Coin2(433, 241);
      this.addChild(coin2);
      var coin3 = new Coin3(530, 241);
      this.addChild(coin3);
   }
});

var Coin1 = cc.Sprite.extend({
  ctor: function(x, y){
    this._super();
    this.initWithFile(res.coins_png);
    this.setPosition(x, y);
    var animationframe = [];
    //スプライトフレームを格納する配列
    var texture = cc.textureCache.addImage(res.coins_png);
    for (i = 0; i < 1; i++) {
      for (j = 0; j < 8; j++) {
        //スプライトフレームを作成
        var frame = new cc.SpriteFrame.createWithTexture(texture, cc.rect(24 * j, 24 * i, 24, 24));
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
  update: function(){}
});

var Coin2 = cc.Sprite.extend({
  ctor: function(x, y){
    this._super();
    this.initWithFile(res.coins_png);
    this.setPosition(x, y);
    var animationframe = [];
    //スプライトフレームを格納する配列
    var texture = cc.textureCache.addImage(res.coins_png);
    for (i = 1; i < 2; i++) {
      for (j = 0; j < 8; j++) {
        //スプライトフレームを作成
        var frame = new cc.SpriteFrame.createWithTexture(texture, cc.rect(24 * j, 24 * i, 24, 24));
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
  update: function(){}
});

var Coin3 = cc.Sprite.extend({
  ctor: function(x, y){
    this._super();
    this.initWithFile(res.coins_png);
    this.setPosition(x, y);
    var animationframe = [];
    //スプライトフレームを格納する配列
    var texture = cc.textureCache.addImage(res.coins_png);
    for (i = 2; i < 3; i++) {
      for (j = 0; j < 8; j++) {
        //スプライトフレームを作成
        var frame = new cc.SpriteFrame.createWithTexture(texture, cc.rect(24 * j, 24 * i, 24, 24));
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
  update: function(){}
});

//キーボードリスナーの実装
var keylistener = cc.EventListener.create({
   event: cc.EventListener.KEYBOARD,

   onKeyPressed: function(keyCode, event) {
      if (keyCode == 65) { // a-Keyで左に移動
        if (player.workingFlag == false) {
          player.stopAction(action_I);
          player.runAction(action_W);
        }
        player.workingFlag = true;
         player.xSpeed = -2.5;
      }
      if (keyCode == 68) { // d-Keyで左に移動
        if (player.workingFlag == false) {
          player.stopAction(action_I);
          player.runAction(action_W);
        }
         player.workingFlag = true;
         player.xSpeed = 2.5;
      }
      if (keyCode == 87) {
        if (player.fallFlg == true || player.jumpFlag == true) {
          player.jumpFlag = false;
          player.junpatackFlg = true;
          player.runAction(action_JA);
        }else if (player.workingFlag == true) {
          player.workingFlag = false;
          player.atackFlg = true;
          player.stopAction(action_W);
          player.runAction(action_A);
        }else if(player.atackFlg == false){
          player.atackFlg = true;
          player.stopAction(action_I);
          player.runAction(action_A);
        }
      }
      if (keyCode == 32) { // スペースキーか上矢印キーでジャンプ
        if (player.workingFlag == true) {
          player.workingFlag = false;
          player.stopAction(action_W);
        }
        else player.stopAction(action_I);
         if (player.jumpFlag == false && player.ySpeed == 0) player.ySpeed = 10;
         player.runAction(action_J);
         player.jumpFlag = true;
      }
      return true;
   },
   onKeyReleased: function(keyCode, event) {
     if (player.workingFlag == true) {
       player.stopAction(action_W);
       player.runAction(action_I);
     }else if (player.atackFlg == true) {
       player.scheduleOnce(this.atkchenge, 0.06);
     }
     else player.scheduleOnce(this.jatkchenge, 1);
      player.workingFlag = false;
      player.jumpFlag = false;
      player.junpatackFlg = false;
      player.atackFlg = false;
      player.xSpeed = 0;
   },
   jumpchenge: function(){
     player.runAction(action_I);
   },
   atkchenge: function(){
     player.stopAction(action_A);
     player.runAction(action_I);
   },
   jatkchenge: function(){
     player.runAction(action_I);
   }
});
