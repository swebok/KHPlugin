
$(function () {
    var menu = [
        {
            tab:"queueTab",
            label:"队列设置"
        }
    ];
    $.each(menu,function(i,item){

    });

    //init
    var queueConfig = store("queueConfig");
    queueConfig = queueConfig?JSON.parse(queueConfig):[]; //[{name:1,value:"a11"}]

    $.each(queueConfig,function(i,item){
        generateQueueBtn(item);
    });


    $("#saveQueueBtn").click(function(){
        var val = $("#configQueueArea").val();
        var name = $("#queueNameTxt").val();
        if(!val||!name){
            return;
        }
        var item = null;
        for(var k=0;k<queueConfig.length;k++){
            var kitem = queueConfig[k];
            if(kitem.name == name){
                item = kitem;
            }
        }
        if(!item){
            item = {};
            item.name=name;
            item.value = val;
            queueConfig.push(item);
            //生成新按钮
            generateQueueBtn(item);
        }else{
            item.value = val;    
        }
        saveQueueConfig();
        $("#configQueueArea").val("");
        $("#queueNameTxt").val("");
        $("#displayQueueArea").val("")
    });
    $("#displayQueueBtn").click(function(){
        displayTextQueueConfig();
    });


    //hotkey
    var enableHotkey = store("enableHotkey");
    if(enableHotkey=="true"){
        enableHotkey = true;
    }else{
        enableHotkey = false;
    }
    $("#enableHotkey").prop("checked",enableHotkey);
    $("#enableHotkey").change(function(e){
        store("enableHotkey",$(this).prop("checked"));
    });

	var autoStartBattle = store("autoStartBattle");
    if(autoStartBattle=="true"){
        autoStartBattle = true;
    }else{
        autoStartBattle = false;
    }
    $("#autoStartBattle").prop("checked",autoStartBattle);
    $("#autoStartBattle").change(function(e){
        store("autoStartBattle",$(this).prop("checked"));
    });


	//
	store("extensionId", chrome.i18n.getMessage("@@extension_id"));
	
	//
    var autoUseSkill = store("autoUseSkill");
    if(autoUseSkill=="true"){
        autoUseSkill = true;
    }else{
        autoUseSkill = false;
    }
    $("#autoUseSkill").prop("checked",autoUseSkill);
    $("#autoUseSkill").change(function(e){
        store("autoUseSkill",$(this).prop("checked"));
    });

    $("#transPackBtn").click(function(){
        var picAddr = $("#picAddr").val();
        var picOriAddr = transStrToAddr(picAddr);
// window.blowfish.decrypt(,"bLoWfIsH",{outputType:1,cipherMode:0})

        $("#picOriAddr").val(picOriAddr);
        
    });

    $("#searchPic").click(function(){
        $("#imageCon").empty();
        var patternAddr = $("#patternPicAddr").val();
        var oriMinPicCode = $("#minPicCode").val();
        var minPicCode = parseInt(oriMinPicCode);
        var maxPicCode = parseInt($("#maxPicCode").val());
        if(patternAddr.indexOf("$")==-1){
            alert("模式地址需要含有替换占位符$");
            return;
        }
        if(isNaN(minPicCode)){
            if(isNaN(maxPicCode)){
                maxPicCode = minPicCode;
            }
            alert("编码必须为数字");
            return;   
        }
        var length = oriMinPicCode.length;
        for(var i=minPicCode;i<=maxPicCode;i++){
            var code = i+"";
            while(code.length<length){
                code="0"+code;
            }
            renderImage(patternAddr,code);
        }
    });


    function renderImage(patternAddr,code){
        var picAddr = patternAddr.replace("$",code);

        var div = $("<div class='col-md-4' style='margin-top:3px;margin-left:10px'></div>");
        $("#imageCon").append(div);
        div.append(picAddr+":");
        var picOriAddr = transStrToAddr(picAddr);
        var img = new Image();
        img.src = picOriAddr;

        img.onerror = function(){
            div.append("<div>无图片</div>");
        }
        img.onload = function(){
            if(img.complete){
                // div.append("<div>"+picOriAddr+"<div>");
                // $("<div class="col-md-8"></div>")
                $(img).css("max-width","350px");
                div.append(img);
            }
        }
    }

    function transStrToAddr(picAddr){
        var str = window.blowfish.encrypt(picAddr,"bLoWfIsH",{outputType:1,cipherMode:0});
        var picOriAddr = "https://static-r.kamihimeproject.net/resources/pc/normal/"+str.substring(str.length-4,str.length-2)+"/"+str.substring(str.length-2)+"/"+str;
        if(picAddr.indexOf("gachaimg")>-1||picAddr.indexOf("gachatop")>-1||picAddr.indexOf("pageimg_topbg")>-1||picAddr.indexOf("introduceimg")>-1||picAddr.indexOf("questimg")>-1
            ||picAddr.indexOf("conquest-bg")>-1||picAddr.indexOf("raid-bg")>-1){
            picOriAddr+=".jpg";
        }else{
            picOriAddr+=".png";
        }
        return picOriAddr;
    }

    $("#transPicCodeBtn").click(function(){
        var picOriAddr = $("#picOriAddr").val();
        var picOriAddr = picOriAddr.substring(picOriAddr.lastIndexOf("/")+1,picOriAddr.lastIndexOf("."));
        var str = window.blowfish.decrypt(picOriAddr,"bLoWfIsH",{outputType:1,cipherMode:0});
        
// window.blowfish.decrypt(,"bLoWfIsH",{outputType:1,cipherMode:0})

        $("#picAddr").val(str);
    });






    

    function generateQueueBtn(item){
        var group =$('<div class="btn-group" style="margin-left:10px;margin-bottom:5px"></div>');
        var btn = $('<button type="button" class="btn btn-default">'+item.name+'</button>');
        group.append(btn);
        var closeBtn = $('<button type="button" class="btn btn-default"><span aria-hidden="true">×</span></button>');
        group.append(closeBtn);
        $("#queueGroup").append(group);
        btn.click(function(){
            $("#queueNameTxt").val(item.name);
            $("#configQueueArea").val(item.value);
            displayTextQueueConfig(); 
        });
        closeBtn.click(function(){
            group.remove();
            for(var k=0;k<queueConfig.length;k++){
                var kitem = queueConfig[k];
                if(kitem.name == item.name){
                    queueConfig.splice(k,1);
                    break;
                }
            }
            saveQueueConfig();
        });
    }


    function displayTextQueueConfig(){
        var val = $("#configQueueArea").val();
        var configArr = val.split("\n");
        var displayValArr = [];
        for(var i=0;i<configArr.length;i++){
            var item = configArr[i];
            if(item){
                if(item.substring(0,1)=="a"){
                    displayValArr.push(parseInt(item.substring(1,2))+"位置"+parseInt(item.substring(2,3))+"技能");
                }else if(item.substring(0,1)=="b"){
                    displayValArr.push("攻击");
                }else if(item.substring(0,1)=="r"){
                    displayValArr.push("reload");
                }else if(item.substring(0,1)=="w"){
                    displayValArr.push("wait stun");
                }else if(item.substring(0,1)=="h"){
                    displayValArr.push("放怪");
                }else if(item.substring(0,1)=="R"){
                    displayValArr.push("过图标记");
                }else if(item.substring(0,1)=="c"){
                    if(item.length>=2){
                        var summonPos = parseInt(item.substring(1,2));
                        if(!isNaN(summonPos)){
                             displayValArr.push("幻兽"+summonPos);
                        }
                    }
                }
            }
        }
        $("#displayQueueArea").val(displayValArr.join("\n"));
    }

    function saveQueueConfig(){
        store("queueConfig",JSON.stringify(queueConfig));
    }

    function store(key,value){
        if(value===undefined){
            return window.localStorage[key];
        }else{
            window.localStorage[key] = value;
        }
    }    

});