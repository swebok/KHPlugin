function injectCode(script){
	// var injectedCode = script;
	// var script = document.createElement('script');
	// script.appendChild(document.createTextNode(injectedCode));
	// (document.body || document.head || document.documentElement).appendChild(script);
	var s = document.createElement('script');
	s.src = chrome.extension.getURL(script);
	(document.head||document.documentElement).appendChild(s);
	s.parentNode.removeChild(s);
}

if(window.location.toString().indexOf("http://www.dmm.co.jp/netgame/social/-/gadgets/=/app_id=242584")>-1
	||window.location.toString().indexOf("http://www.dmm.com/netgame/social/-/gadgets/=/app_id=753201")>-1
	||window.location.toString().indexOf("http://pc-play.games.dmm.co.jp/play/kamipro_X_Gro")>-1){
//	window.location = $("#app_frame").attr("src");
	// $(function(){
	// 	$("#game_frame").height(1240);
	// });
	$(function(){
		setTimeout(function(){
			$("#w > div.dmm-ntgnavi.adult > div > nav.ntgnavi-left").remove();
		},5000);
		
	});
		
}else if(window.location.toString().indexOf("http://osapi.dmm.com/gadgets/ifr")>-1){
	$(function(){
		// injectCode("jquery.js");sjp
		injectCode("inject/injectParent.js");		



		/*
		injectCode("(function(){window.rpc.updateHeight = function(){};"+
			//"rpc.closeError = function(){$('#error_dialog').remove();};"+
			//"rpc.closeConnecting = function(){$('#shield').remove();};"+
			"$('#game-outer').height(420);$('#game-outer').width(640);})(window)");*/
		//rpc.updateHeight = function(){};
		//rpc.closeError = function(){$("#error_dialog").remove();};
		//rpc.closeConnecting = function(){$("#shield").remove();}
		//$("#game").height(420);
		//去掉connecting
		//关闭错误


		chrome.runtime.sendMessage({type: "getSettings"}, function (settings) {
	    	if(settings.enableHotkey){

	    		$(document).on("keydown",function(e){
					if(e.target.nodeName=="TEXTAREA"||(e.target.nodeName=="INPUT"&&e.target.type=="text")){
						return;
					}
					var allKeys = " 123456asdfgqwertyuEscapeArrowUpArrowDown";
					if(allKeys.indexOf(e.key)>-1){
						var ifr = document.getElementById("game");
			    		if(ifr!=null){
			    			var param = {type:"keydown",key:e.key};
			    			ifr.contentWindow.postMessage(JSON.stringify(param), '*');	
			    		}	
					}
					if(e.key==" "){
						return false;
					}
	    		});
	    	}
	    });

	});
}else if((window.location.toString().indexOf(".kamihimeproject.net")>-1 && window.location.toString().indexOf("/tyrano.html")==-1) ||
		(window.location.toString().indexOf(".skh.dmmgames.com")>-1 && window.location.toString().indexOf("/tyrano.html")==-1)){
	console.log(window.location.toString());
	var obj = window.kh;
	$(function(){

		var hiddenKeyDiv = $("<div id='hiddenKeyDiv' style='display:none'></div>");
		$("body").append(hiddenKeyDiv);
		window.addEventListener('message', function(e) {
			//因为页面本身有监听用json解析了
			try {
	            var data = JSON.parse(e.data);
	        } catch (i) {
	        	console.log(i);
	        	var data={};
	        }
		    if(data.type=="reload"){
		    	window.location.reload();
		    }else if(data.type=="keydown"){
		    	//chrome 
		    	try{
			    	var customEvent = document.createEvent("UIEvents");
			    	customEvent.initUIEvent('keydown', true, true,window,1);
			    	hiddenKeyDiv.text(data.key);
			    	document.dispatchEvent(customEvent);
		    	}catch(i){
		    		console.log(i);
		    	}
		    }
		});
		//(rpc.updateHeight = function(){};$('#game').height(420);)();
		// injectCode("jquery.js");
		injectCode("inject/common.js");
		var hiddenDiv = $("<div id='hiddenDiv' style='display:none'></div>");
		$("body").append(hiddenDiv);

		chrome.runtime.sendMessage({type: "getSettings"}, function (settings) {
	    	hiddenDiv.text(JSON.stringify(settings));
	    	if(window.location.toString().indexOf("/battle")>-1){
				injectCode("inject/battle.js");
			}else if(window.location.toString().indexOf("/mypage_quest_party_guild_enh_evo_gacha_present_shop_epi")>-1){
				injectCode("inject/mypage.js");
				
			}
	    });
	});
	
/*
	var injectedCode = '$(document.body).append("<input type=\'hidden\' id=\'datachannel\' value=\'"+JSON.stringify(flashvars)+"\'></input>")';
	var script = document.createElement('script');
	script.appendChild(document.createTextNode('('+ injectedCode +')();'));
	(document.body || document.head || document.documentElement).appendChild(script);
	script = document.createElement('script');
	script.appendChild(document.createTextNode('(window.onbeforeunload=null)();'));
	document.body.appendChild(script);
	*/


}