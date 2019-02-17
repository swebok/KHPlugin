$(function(){
	 $("body").on("DOMNodeInserted",function(e){
	 	if(e.target.nodeName=="SCRIPT"&&e.target.src.indexOf("main.js")>-1){
	 		$("body").off("DOMNodeInserted");
	 		var tempHandler = e.target.onload;
	 		e.target.onload = function(){
	 			tempHandler.call(this);
				window.rpc.updateHeight = function (height) {
				    if (window.gadgets) {
				      	gadgets.window.adjustHeight();
				      	window.rpc.updateHeight = function(){};
				      	$("#game-outer").css("background","none").css("width","100%");
				    }
			    }				
				$(".test-screen").width("100%").css("margin","0").css("margin-top","40px");
				// $("div.wrapper.center-block").remove();
				$("div.banner_middle").remove();
				
				// $("#game").height(420);
				// $('#game-outer').height(440);
				// $('#game-outer').width("auto");
				// window.rpc.closeError = function(){$("#error_dialog").remove();};
				// window.rpc.closeConnecting = function(){$("#shield").remove();}



				$("#game").attr("scrolling","no");
				var heightStr = store("heightConfig");
				var styleStr;
				if(heightStr=="420"){
					styleStr = "<style>.ticker{margin:0;width: 960px;}\n#error_dialog{width:960px}</style>";
				}else{
					styleStr = "<style>.ticker{margin:0;width: 960px;}\n#loading__img{right:320px}\n#error_dialog{width:960px}</style>";
				}
				$(styleStr).appendTo($("body"));

				if(heightStr){
					$("#game").height(heightStr);
					$('#game-outer').height(parseInt(heightStr)+20);
				}
				var btn = $("<button type='button' class='btn btn-default' style='position: absolute;top: 10px;left: 780px;'>正常版</button>")
				btn.click(function(){
					$("#game").height(640);
					$('#game-outer').height(660);
					store("heightConfig",640);
				});
				$(".test-screen.center-block").append(btn);
			
				var btn = $("<button type='button' class='btn btn-default' style='position: absolute;top: 10px;left: 850px;'>缩小版</button>")
				btn.click(function(){
					$("#game").height(320);
					$('#game-outer').height(340);
					store("heightConfig",320);
				});
				$(".test-screen.center-block").append(btn);

				var btn = $("<button type='button' class='btn btn-default' style='position: absolute;top: 10px;left: 950px;'>重新加载</button>")
				btn.click(function(){
					var ifr = document.getElementById("game");
 				    ifr.contentWindow.postMessage('{"type": "reload"}', '*');
				});
				$(".test-screen.center-block").append(btn);

				var btn = $("<button type='button' class='btn btn-default' style='position: absolute;top: 10px;left: 1050px;'>关闭error</button>")
				btn.click(function(){
					$("#error_dialog").remove();
				});
				$(".test-screen.center-block").append(btn);
				var btn = $("<button type='button' class='btn btn-default' style='position: absolute;top: 10px;left: 1150px;'>关闭conn</button>");
				btn.click(function(){
					$("#shield").remove();
				});
				$(".test-screen.center-block").append(btn);
	 		}
	 		
	 	}
	 });
});
function store(key,value){
	if(value===undefined){
		return window.localStorage[key];
	}else{
		window.localStorage[key] = value;
	}
}
/*
setTimeout(function(){
	// $('#game-outer').width(640);
	// $('#game-outer').height(420);

	init();

	var btn = $("<button type='button' class='btn' style='position: absolute;top: 10px;left: 850px;'>正常版</button>")
	btn.click(function(){
		$("#game").height(640);
		$('#game-outer').height(660);
		store("heightConfig",640);
	});
	$(".test-screen.center-block").append(btn);
	var btn = $("<button type='button' class='btn' style='position: absolute;top: 10px;left: 950px;'>缩小版</button>")
	btn.click(function(){
		$("#game").height(420);
		$('#game-outer').height(440);
		store("heightConfig",420);
	});
	$(".test-screen.center-block").append(btn);
	var btn = $("<button type='button' class='btn' style='position: absolute;top: 10px;left: 1050px;'>关闭error</button>")
	btn.click(function(){
		$("#error_dialog").remove();
	});
	$(".test-screen.center-block").append(btn);
	var btn = $("<button type='button' class='btn' style='position: absolute;top: 10px;left: 1150px;'>关闭conn</button>")
	btn.click(function(){
		$("#shield").remove();
	});
	$(".test-screen.center-block").append(btn);

	function store(key,value){
		if(value===undefined){
			return window.localStorage[key];
		}else{
			window.localStorage[key] = value;
		}
	}
		
	function init(){
		if(window.rpc&&window.rpc.updateHeight){
			window.rpc.updateHeight = function(){};
			$(".test-screen").width("100%").css("margin","0").css("margin-top","40px");
			$("#game-outer").css("background","none").css("width","100%").css("margin","0");
			// $("#game").height(420);
			// $('#game-outer').height(440);
			// $('#game-outer').width("auto");
			// window.rpc.closeError = function(){$("#error_dialog").remove();};
			// window.rpc.closeConnecting = function(){$("#shield").remove();}
			var heightStr = store("heightConfig");
			if(heightStr){
				$("#game").height(heightStr);
				$('#game-outer').height(parseInt(heightStr)+20);
			}
		}else{
			setTimeout(init,500);
		}
	}
},3000);
*/
