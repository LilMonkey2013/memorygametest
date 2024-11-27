function CInterface(szTimeLeft){
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosScoreText;
    var _pStartPosTimeText;
	var _pStartPosFullscreen;
	var _oContainerPause;
    var _oTimeLeft;
    var _oTimeLeft; 
    var _oScore;
    var _oAudioToggle;
    var _szTimeLeft;
    var _oButExit;
    var _oScoreMultText;
	var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    this._init = function(szTimeLeft){
		
	_oContainerPause = new createjs.Container();
	_oContainerPause.visible = false;
	s_oStage.addChild(_oContainerPause);

	var oFade = new createjs.Shape();
	oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	oFade.alpha = 0.5;
	_oContainerPause.addChild(oFade);
	
	var oTextPause = new createjs.Text(TEXT_PAUSE,"120px "+FONT_GAME, "#fff");
	oTextPause.textAlign = "center";
	oTextPause.textBaseline = "alphabetic";
	oTextPause.x = CANVAS_WIDTH/2;
	oTextPause.y = CANVAS_HEIGHT/2;
	_oContainerPause.addChild(oTextPause);
	
	//var oSpriteResume = s_oSpriteLibrary.getSprite('but_resume');
	
	var _oButResume = new CTextButton(CANVAS_WIDTH/2,650,
                                            s_oSpriteLibrary.getSprite('but_menu_bg'),
                                            "RESUME",
                                            FONT_GAME,
                                            "White",
                                            "20",
                                            _oContainerPause);
	_oButResume.setScale(2);
	_oButResume.addEventListener(ON_MOUSE_UP, this._onResume, this);

	//var oSpriteQuit = s_oSpriteLibrary.getSprite('but_resume');
	var _oButQuit = new CTextButton(CANVAS_WIDTH/2,770,
                                            s_oSpriteLibrary.getSprite('but_menu_bg'),
                                            "QUIT",
                                            FONT_GAME,
                                            "White",
                                            "20",
                                            _oContainerPause);
	_oButQuit.setScale(2);
	_oButQuit.addEventListener(ON_MOUSE_UP, this._onExit, this);
	
	_pStartPosTimeText = {x:30,y:30};
        _szTimeLeft = TEXT_TIMELEFT + szTimeLeft;
        _oTimeLeft = new CTLText(s_oStage, 
                    _pStartPosTimeText.x-250, _pStartPosTimeText.y, 500, 50, 
                    50, "left", "#fff", FONT_GAME, 1,
                    0, 0,
                   _szTimeLeft,
                    true, true, false,
                    false );
                    
        _oTimeLeft.setShadow("#000000", 2, 2, 2);


	_pStartPosScoreText = {x:CANVAS_WIDTH/2,y:75};
  
        _oScore = new CTLText(s_oStage, 
                    _pStartPosScoreText.x-250, _pStartPosScoreText.y, 500, 36, 
                    36, "center", "#fff", FONT_GAME, 1,
                    0, 0,
                   TEXT_SCORE + "0",
                    true, true, false,
                    false ); 
        
        _oScore.setShadow("#000000", 2, 2, 2);

        _oScoreMultText = new createjs.Text("X2", "150px "+FONT_GAME, "#fff");
        _oScoreMultText.textAlign = "center";
        _oScoreMultText.textBaseline = "alphabetic";
        _oScoreMultText.x = CANVAS_WIDTH/2;
        _oScoreMultText.y = CANVAS_HEIGHT/2;
        _oScoreMultText.shadow = new createjs.Shadow("#000000", 2, 2, 2);
        _oScoreMultText.scaleX = _oScoreMultText.scaleY = 0.1;
        _oScoreMultText.visible = false;
        s_oStage.addChild(_oScoreMultText);

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x:CANVAS_WIDTH - (oSprite.width/2) - 20,y:(oSprite.height/2) + 20};
        var oSprite2 = s_oSpriteLibrary.getSprite('audio_icon');
        _pStartPosAudio = {x:CANVAS_WIDTH - (oSprite2.width/2)*2 - 10,y:(oSprite2.height/2) + 20};
		
        
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onResume, this);

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){   
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite2,s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            _pStartPosFullscreen = {x:_pStartPosAudio.x-oSprite.width - 20,y:_pStartPosAudio.y};
        }else{
                _pStartPosFullscreen = {x:_pStartPosExit.x-oSprite.width - 20,y:_pStartPosExit.y};
        }
		
	
	this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
	
    this.refreshButtonPos = function(iNewX,iNewY){
        _oScore.setY(_pStartPosScoreText.y + iNewY);

        _oTimeLeft.setX(_pStartPosTimeText.x + iNewX);
        _oTimeLeft.setY(_pStartPosTimeText.y + iNewY);

        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
		if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX,_pStartPosFullscreen.y + iNewY);
        }
    };
    
    this.unload = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                _oAudioToggle.unload();
        }
		if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        _oButExit.unload();


	s_oInterface = null;
    };

    this.refreshScore = function(iScore){
        _oScore.refreshText(TEXT_SCORE + iScore);
    };
	
    this.showMultiplier  = function(iMult){
        _oScoreMultText.text = "X"+iMult;
        _oScoreMultText.visible = true;

        createjs.Tween.get(_oScoreMultText).to({scaleX:1,scaleY:1}, 300,createjs.Ease.cubicOut).call(function(){
                                                        createjs.Tween.get(_oScoreMultText).to({scaleX:0.1,scaleY:0.1}, 300,createjs.Ease.cubicIn).call(function(){
                                                                                                                                                _oScoreMultText.visible = false;
                                                                                                                                            }); 
                                                                                            });  
    };

    this.update = function(szTimeLeft){
        _oTimeLeft.refreshText(TEXT_TIMELEFT + szTimeLeft);
    };

    this._onExit = function(){
        s_oGame.unload(true);
    };

    this._onResume = function(){
        //s_oGame.unload(true);
		if(!s_oGame.suspended())
		{
			s_oGame.suspendUpdates();
			_oContainerPause.visible = true;
		}
		else
		{
			s_oGame.restartUpdates();
			_oContainerPause.visible = false;
		}
    };
	
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.enabled){
		_oButFullscreen.setActive(s_bFullscreen);
	}
    };
    
    this._onFullscreenRelease = function(){
        if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
	
	
    s_oInterface = this;
    
    this._init(szTimeLeft);
    
    return this;
}

var s_oInterface = null;