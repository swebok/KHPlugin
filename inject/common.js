var yutil ={};
yutil.store = function(key,value){
	if(value===undefined){
		return window.localStorage[key];
	}else{
		window.localStorage[key] = value;
	}
}
yutil.hookMethod = function(container,funName,afterFun){
	var oriFun = container[funName];
	if(oriFun){
		container[funName] = function(){
			oriFun.apply(this,arguments);
			afterFun.apply(this,arguments);
		}
	}
}


$(function(){
	
	var temp = window.onerror;
	window.onerror = function(e){
		//去掉默认的处理 防止error上报
		if(e&&e.stack){
			store("lastError",e.stack);	
		}
		console.log(e);
		window.kh.postMessage("openErrorDialog", [0]);
		return false;
	}
	console.error = function(e){
		if(e&&e.stack){
			store("lastError",e.stack);	
		}
		console.log(e);
		window.kh.postMessage("openErrorDialog", [0]);
		return false;	
	}
	//window.ccui.Widget.TOUCH_ENDED==2
	delete console.log;//神TM被覆盖了
	//有的版本删除后没了
	if(!console.log){
		console.log = function(e){
		}
	}

	var logger = window.kh.createInstance("logger");
    if(logger){
    	logger.reportJsException = function(e){
    		// delete console.log;
    		console.log(e);
    	}
    	logger.reportCommunicationError = function(e){
    		console.log(e);
    		return "网络请求失败";
    	}
    }
	var marginAdjustId= setInterval(function(){
		if($("#Cocos2dGameContainer").length>0){
			if($(window).height()<500){
				$("#Cocos2dGameContainer").css("margin","0px 0px 0px 100px");
			}else{
				$("#Cocos2dGameContainer").css("margin","0px");
			}
			clearInterval(marginAdjustId);
		}
	},10);
});