$(function(){
	var settings = JSON.parse($("#hiddenDiv").text());
	console.log(settings);
	var store = yutil.store;
	var hookMethod = yutil.hookMethod;
	var _wld;
	
	function timeInit(){
		//createDebugBtn();
		displayHpAndMode();
		if(settings.enableHotkey){
			bindHotkey();	
		}
		if (settings.autoStartBattle) {
			setTimeout(autoStartBattle, 1000);
		}
	}
	setTimeout(showWld, 1000);
	setTimeout(timeInit,1000);
	
	function wld(){
		if(!_wld){
			_wld = window.kh.createInstance("battleWorld");
			if(!(_wld&& _wld.battleUI)){
				_wld = null;
				return;
			}
		}
		return _wld;
	};
	
	function showWld() {
		var w = wld();
		if (typeof(w) != "undefined") {
			console.log(w);
			return;
		}
		console.log("no wld");
		setTimeout(showWld, 1000);
	};
	
	function autoStartBattle() {
		var w = wld();
		if (!w || !w.battleUI) {
			setTimeout(autoStartBattle, 1000);
			return false;
		}

		var centerPanel = w.battleUI.CenterPanel;
		if (centerPanel._visibleButton == centerPanel.BUTTONS.ATTACK && w.battleUI.AttackButton._widget.isEnabled()) {
			
			if (settings.autoUseSkill) {
					w.battleUI.AutoButton._onTouchEvent(w.battleUI.AutoButton._widget, 2);
			}
			w.battleUI.AutoButton._onTouchEvent(w.battleUI.AutoButton._widget, 2);
			w.battleUI.AttackButton.simulateAttack();
			setInterval(endBattle, 2000);
			return true;
		} else if (centerPanel._visibleButton == centerPanel.BUTTONS.NEXT && w.battleUI.NextButton._widget.isEnabled() && w.battleUI.NextButton._onTouchCallback) {
			w.battleUI.NextButton._onTouchCallback();
			return true;
		}
		setTimeout(autoStartBattle, 1000);
		return false;
	};

	function endBattle() {
		var w = wld();
		var centerPanel = w.battleUI.CenterPanel;
		if (centerPanel._visibleButton == centerPanel.BUTTONS.ATTACK && w.battleUI.AttackButton._widget.isEnabled()) {
			w.battleUI.AttackButton.simulateAttack();
			return false;
		}
		if (centerPanel._visibleButton == centerPanel.BUTTONS.NEXT && w.battleUI.NextButton._widget.isEnabled() && w.battleUI.NextButton._onTouchCallback) {
			w.battleUI.NextButton._onTouchCallback();
			return true;
		}
		return false;
	};
	
	function displayHpAndMode(){
		var oriAdjustHp = window.kh.EnemyStatusBar.prototype.adjustHP;
		function createHpTxt(p){
			var hpNumTxt = p.seekWidgetByName("hpNum");
			if(!hpNumTxt){
				hpNumTxt = new ccui.Text();
				hpNumTxt.name="hpNum";
				hpNumTxt.setFontSize(12);
				hpNumTxt.setTextHorizontalAlignment(2);
				hpNumTxt.setPosition(p.width-170,p.height-20);
				p.addChild(hpNumTxt);
			}
			hpNumTxt.setTextAreaSize({width:300,height:0});
			return hpNumTxt;
		}
		function createModeTxt(p){
			var modeNumTxt = p.seekWidgetByName("modeNum");
			if(!modeNumTxt){
				modeNumTxt = new ccui.Text();
				modeNumTxt.name="modeNum";
				modeNumTxt.setFontSize(12)
				modeNumTxt.setPosition(330,10);
				p.addChild(modeNumTxt);
			}
			return modeNumTxt;
		}
		window.kh.EnemyStatusBar.prototype.adjustHP = function(t, n){
			oriAdjustHp.call(this,t,n);
			var p = this._hpGauge.parent;
			var hpNumTxt = createHpTxt(p);
			hpNumTxt.setString(t+"/"+this.hpmax);
		}
		var oriInitBase = window.kh.EnemyStatusBar.prototype._initBase;
		window.kh.EnemyStatusBar.prototype._initBase = function(t, n, s){
			oriInitBase.call(this,t,n,s);
			var p = this._hpGauge.parent;
			var hpNumTxt = createHpTxt(p);
			this.hpmax = t.hpmax;
			hpNumTxt.setString(t.hp+"/"+t.hpmax);
		}
		var oriInitModeGauge = window.kh.EnemyStatusBar.prototype._initModeGauge;
		window.kh.EnemyStatusBar.prototype._initModeGauge = function(t){
			oriInitModeGauge.call(this,t);
			if(t.has_mode_gauge&&this._modeGauge){
				var p = this._modeGauge.parent;
				var modeNumTxt = createModeTxt(p);
				var per = t.mode_gauge_percent.toFixed?t.mode_gauge_percent.toFixed(2):t.mode_gauge_percent;
				modeNumTxt.setString(per+"%");	
			}
		}
		var oriAdjustModeGauge = window.kh.EnemyStatusBar.prototype.adjustModeGauge;
		window.kh.EnemyStatusBar.prototype.adjustModeGauge = function(t){
			oriAdjustModeGauge.call(this,t);
			if(this._modeGauge){
				var p = this._modeGauge.parent;
				var modeNumTxt = createModeTxt(p);
				var per = t.toFixed?t.toFixed(2):t;
				modeNumTxt.setString(per+"%");	
			}
		}


	}

	

	function bindHotkey(){

		var keyMap = {
			"0":"q",
			"1":"w",
			"2":"e",
			"3":"r",
			"4":"t",
			"5":"y",
			"6":"u",
		}

		hookMethod(kh.Initializer.BattleUIInitializer.prototype,"_initCharacterPanels",function(t){
			var con = kh.createInstance("characterStatusPanelHandler")._pageControlWidget;
			var cpList = this.battleUI.CharacterPanelList;

			if(cpList){
				_.each(cpList,function(item,i){
					var panel = item._slot;
					//var key = keyMap[i];
					var txt = new ccui.Text();
					txt.setString(i+1);
					txt.setFontSize(19);
					txt.setPosition(15,30);
					panel.addChild(txt);
				});
			}
		});

		hookMethod(kh.CharacterStatusPanel.prototype,"_initElements",function(){
			var widget = this._widget;
			_.map(_.range(4), function(n) {
                var a = widget.seekWidgetByName("ability_ui_" + n);
                if(a){
                	var txt = new ccui.Text();
					txt.setString(keyMap[n]);
					txt.setFontSize(24);
					txt.setPosition(17,20);
					a.addChild(txt);
                }
            });
		});

		hookMethod(kh.Initializer.BattleUIInitializer.prototype,"_initBurstButton",function(t){
			var widget = this.battleUI.BurstButton._widget;
			var txt = new ccui.Text();
			txt.setString("s");
			txt.setFontSize(24);
			txt.setPosition(25,75)
			widget.addChild(txt);
		});
		hookMethod(kh.Initializer.BattleUIInitializer.prototype,"_initHealButton",function(t){
			var widget = this.battleUI.HealButton._widget;
			var txt = new ccui.Text();
			txt.setString("a");
			txt.setFontSize(24);
			txt.setPosition(25,75)
			widget.addChild(txt);
		});
		hookMethod(kh.Initializer.BattleUIInitializer.prototype,"_initAutoButton",function(t){
			var widget = this.battleUI.AutoButton._widget;
			var txt = new ccui.Text();
			txt.setString("d");
			txt.setFontSize(19);
			txt.setPosition(25,68);
			widget.addChild(txt);
		});
		hookMethod(kh.Initializer.BattleUIInitializer.prototype,"_initAttackButton",function(t){
			var widget = this.battleUI.AttackButton._widget;
			var txt = new ccui.Text();
			txt.setString("Space");
			txt.setFontSize(19);
			txt.setPosition(60,140)
			widget.addChild(txt);
		});

		hookMethod(kh.Initializer.BattleUIInitializer.prototype,"_initSummonButton",function(t){
			var widget = this.battleUI.SummonButton._widget;
			var txt = new ccui.Text();
			txt.setString("6");
			txt.setFontSize(19);
			txt.setPosition(25,80);
			widget.addChild(txt);
		});
		hookMethod(kh.Initializer.BattleUIInitializer.prototype,"_initReloadButton",function(t){
			var widget = this.battleUI.ReloadButton._widget;
			var txt = new ccui.Text();
			txt.setString("z");
			txt.setFontSize(19);
			txt.setPosition(20,60);
			widget.addChild(txt);
		});
		hookMethod(kh.Initializer.BattleUIInitializer.prototype,"_initSummonPanelGroup",function(t){
			var widget = this.battleUI.SummonPanelGroup._touchPanel;
			var txt = new ccui.Text();
			txt.setString("esc");
			txt.setFontSize(19);
			txt.setPosition(38,50);
			widget.addChild(txt);
			
			var t1 = this.battleUI.SummonPanelGroup._widget;
			var panelList = this.battleUI.SummonPanelGroup.panelList;
			if(panelList){
				_.each(panelList,function(item,i){
					var panel = ccui.helper.seekWidgetByName(t1, "battlecard_summon_ui_" + i);
					var key = keyMap[i];
					var txt = new ccui.Text();
					txt.setString(key);
					txt.setFontSize(24);
					txt.setPosition(15,20);
					panel.addChild(txt);
				});
			}
// this._battleUI.getWidgetByName("battlecard_chara_ui_" + e)
		});


		$(document).on("keydown",exeHotkey);
		$("#gameCanvas").on("keydown",exeHotkey);
	}


	function exeHotkey(e){
		if(e.target.nodeName=="TEXTAREA"||(e.target.nodeName=="INPUT"&&e.target.type=="text")){
			return;
		}
		if(e.key===undefined){
			var hiddenKeyDiv = document.getElementById("hiddenKeyDiv");
			if(hiddenKeyDiv){
				e.key = hiddenKeyDiv.innerText;
				hiddenKeyDiv.innerText = "";
			}
		}

		//攻击
		var w = wld();
		if(!w||!w.battleUI){
			return;
		}
		var key = e.key;
		if(key){
			key = e.key.toLowerCase();
		}else{
			return;
		}


		var handled = false;
		if(key==" "){
			var centerPanel = w.battleUI.CenterPanel
			if(centerPanel._visibleButton==centerPanel.BUTTONS.ATTACK&&w.battleUI.AttackButton._widget.isEnabled()){
				w.battleUI.AttackButton.simulateAttack();	
			}else if(centerPanel._visibleButton==centerPanel.BUTTONS.NEXT&&w.battleUI.NextButton._widget.isEnabled()&&w.battleUI.NextButton._onTouchCallback){
				w.battleUI.NextButton._onTouchCallback();
			}
			handled = true;
		}else if("12345".indexOf(key)>-1){
			if(w.battleUI._isEnabled && !w.battleUI.SummonPanelGroup.isOpened()){
				var cpList = w.battleUI.CharacterPanelList;		
				var ind ="12345".indexOf(key);
				var cp = cpList[ind];
				if(cp&&cp._card._widget.isVisible()){
					if(!kh.createInstance("characterStatusPanelHandler")._open){
						cp.onPushEvent(cpList[ind],2);
					}else{
						var pageView = kh.createInstance("characterStatusPanelHandler")._pageView;
						if(pageView.isEnabled()){
							var pInd = pageView._pageList.indexOf(cp._statusPanel._widget);
							if(pInd>-1){
								pageView.gotoPageByIndex(pInd);	
							}
						}
					}
				}
			}
			
			handled = true;
		}else if(key=="6"){
			if(w.battleUI.SummonButton._widget.isEnabled()){
				w.battleUI.SummonButton.onPushTouchPanel(w.battleUI.SummonButton._widget,2);	
			}
			handled = true;
		}else if(key=="s"){
			//切换
			w._onPushBurstButtonCallback(w.battleUI.BurstButton._widget,2);
			handled = true;
		}else if(key=="a"){
			//治疗弹窗
			if(w.battleUI._isEnabled){
				w._onPushHealButtonCallback(null,2);
			}
			handled = true;
		}else if(key=="d"){
			w.battleUI.AutoButton._onTouchEvent(w.battleUI.AutoButton._widget,2)
			handled = true;
		}else if(key=="z"){
			//重新加载
			w.battleUI.ReloadButton._onTouchEventListener(w.battleUI.ReloadButton._widget,2)
			handled = true;
		}else if(e.key=="Escape"){
			if(w.curePopup._popup&&w.curePopup._popup._isOpened){
				w.curePopup._popup.dismiss();
			}
			//close cooldown  if(kh.createInstance("processPopupFactory"))


			w.battleUI.SummonPanelGroup.close();
			kh.createInstance("characterStatusPanelHandler").close();
			handled = true;
		}else if("qwertyu".indexOf(key)>-1){
			var ind = "qwertyu".indexOf(key);
			if(w.battleUI.SummonPanelGroup.isOpened()){
				var t1 = w.battleUI.SummonPanelGroup._widget;
				var panelList = w.battleUI.SummonPanelGroup.panelList;
				if(panelList&&panelList[ind]){
					var panel = panelList[ind];
					if(panel.isUsable()&&w.battleUI._isEnabled){
						// panelList[ind].pushPanel(null,2);
						cc.eventManager.dispatchCustomEvent(kh.EVENT_NAME.SUMMON_ANIMATION.REQUEST_PLAY, panel.index);
					}
					
				}
			}else if(kh.createInstance("characterStatusPanelHandler")._open){
				var pageView = kh.createInstance("characterStatusPanelHandler")._pageView;
				var currPage = pageView.getCurrentPage();
				var ab = currPage.seekWidgetByName("ability_ui_"+ind);
				if(ab&&ab.isEnabled()&&ab.isVisible()&&ab._children[0].getUserData()&&w.battleUI._isEnabled){
					w._onPushAbilityButtonCallback.call(w,ab._children[0],2);	
				}
			}
			handled = true;
		}else if(e.key=="ArrowUp"){
			if(kh.createInstance("characterStatusPanelHandler")._open){
				var pageView = kh.createInstance("characterStatusPanelHandler")._pageView;
				if(pageView.isEnabled()){
					pageView.gotoPreviousPage();
				}
			}
			handled = true;
		}else if(e.key=="ArrowDown"){
			if(kh.createInstance("characterStatusPanelHandler")._open){
				var pageView = kh.createInstance("characterStatusPanelHandler")._pageView;
				if(pageView.isEnabled()){
					pageView.gotoNextPage();
				}

			}
			handled = true;
		}else if(key=="f"){
			if(w.enemyStatusBarList&&w.enemyStatusBarList.length>1){
				var ind = w.getTarget();
				if(ind<=0){
					nextInd = w.enemyStatusBarList.length-1;
				}else{
					nextInd = ind-1;
				}
				w.enemyStatusBarList[nextInd]._targetEnemy(w.enemyStatusBarList[nextInd],2);
				
			}			
		}else if(key=="g"){
			if(w.enemyStatusBarList&&w.enemyStatusBarList.length>1){
				var ind = w.getTarget();
				var nextInd;
				if(ind==-1||ind>=w.enemyStatusBarList.length-1){
					nextInd = 0;
				}else{
					nextInd = ind+1;
				}
				w.enemyStatusBarList[nextInd]._targetEnemy(w.enemyStatusBarList[nextInd],2);
			}
		}
		return !handled;
	}


});