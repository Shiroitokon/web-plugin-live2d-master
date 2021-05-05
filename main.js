var CONSTANTS = {
    ENABLE: 'Enable',
    DISABLE: 'Disable',
    HIDDEN: 'Hidden',
    SHOW: 'Show',
    OPEN: 'Open',
    CLOSE: 'Close'
};

// 加载插件开启状态
function loadOptions() {
    chrome.extension.sendMessage({name: 'getOptions'}, function (response) {
        // set default as disabled
        if (response === undefined || response.enableDisable === undefined) {
            chrome.extension.sendMessage({name: 'setOptions', status: CONSTANTS.DISABLE}, function () {
            });
        }
    });
}

// 加载气泡开启状态
function loadQiPao() {
    chrome.extension.sendMessage({name: 'getQiPao'}, function (response) {
        // set default as disabled
        if (response === undefined || response.showHidden === undefined) {
            chrome.extension.sendMessage({name: 'setQiPao', status: CONSTANTS.HIDDEN}, function () {
            });
        }
    });
}

//加载声音开启
function loadSound()
{
    chrome.extension.sendMessage({name: 'getSound'}, function (response) {
        // set default as disabled
        if (response === undefined || response.openClose === undefined) {
            chrome.extension.sendMessage({name: 'getSound', status: CONSTANTS.CLOSE}, function () {
            });
        }
    });
}

// 加载插件模型索引
function loadIndex() {
    chrome.extension.sendMessage({name: 'getIndex'}, function (response) {
        // 设置默认模型索引下标 0
        if (response === undefined || response.index === undefined) {
            chrome.extension.sendMessage({name: 'setIndex', status: 0}, function () {
            });
        }

    });
}

function relaodOptions(value) {

    var dv = document.getElementById("waiff");

    if(value && value === CONSTANTS.ENABLE) {
        dv.style.display = "block";
    } else {
        dv.style.display = "none";
    }
    
}


function reloadQiPao(value) {
    var dv = document.getElementById("waifu-tips-controller");

    if(value && value === CONSTANTS.ENABLE) {
        dv.style.display = "block";
    } else {
        dv.style.display = "none";
    }
}

function relaodIndex(value) {
    document.location.reload();
    // chrome.extension.sendMessage({name: 'getDataModel'}, function (response) { 
    //     var list = [];
    //     list = response;
    //     var model = list[value];
    //     var dv = document.getElementById("waifu-tips");
    //     dv.style.top = model.waifuTop;
    //     let canvasElem = document.getElementById("live2d");
    //     var live2dConfig = getLive2dConfig("live2d", model);
    //     L2Dwidget.changeModel(live2dConfig)
    // });
}


function loadlive2d(id, model) {

    var live2dConfig = getLive2dConfig(id, model);

    chrome.extension.sendMessage({name: 'getSound'}, function (response) {
        // set default as disabled
        if (response === undefined || response.openClose === undefined) {
                live2dConfig.model.sound = false;
        }else {
            live2dConfig.model.sound = CONSTANTS.CLOSE === response.openClose? false : true;
        }
        L2Dwidget.init(live2dConfig);
    });
}


function getLive2dConfig(id, model) {

    var url = model.url;
    if(!model.assert) {
       
    }else {
    url = chrome.runtime.getURL(url);
       
    }

   var live2dConfig = {
        model: {
            "jsonPath": url,
            "scale": model.scale ? model.scale : 1,
            "hHeadPos": 0.5,
            "vHeadPos": 0.618,
            "sound": true
        },
        display: {
            "position": "left",
            "hOffset": 0,
            "vOffset": 0,
            "width": model.canvasWidth,
            "height": model.canvasHeight,
            "superSample": 2
        },
        mobile: {
            "show": true,
            "scale": 0.5
        },
        react: {
            "opacityDefault": 0.7,
            "opacityOnHover": 0.2
        },
        name: {
            "canvas": id,
            "div": "live2d-widget"
        },
        autoCreateElement: false,
    }

    return live2dConfig;
}


// 加载模型
function loadModel() {

    chrome.extension.sendMessage({name: 'getCloseRealmNames', realmName: window.location.host}, function (response) {
    
        if(response) {
            return
        }

    chrome.extension.sendMessage({name: 'getOptions'}, function (response) {
        // set default as disabled

        var isShowModel = response != undefined && response.enableDisable === CONSTANTS.ENABLE;

            chrome.extension.sendMessage({name: 'getIndex'}, function (responseIndex) {
                if (responseIndex != undefined && responseIndex.index != undefined) {
                    chrome.extension.sendMessage({name: 'getQiPao'}, function (response) {
                        if (response != undefined) {
                            
                            var getQiPao = response;

                            chrome.extension.sendMessage({name: 'getDataModel'}, function (response) { 

                            var headDiv = document.getElementById("headDiv");
                            if(!headDiv) {
                                headDiv = document.createElement('div');
                            }else {
                                headDiv.remove();
                                headDiv = document.createElement('div');
                            }
                            

                            var list = [];
                            list = response;
                            var model = list[responseIndex.index];

                            headDiv.id = "headDiv";
                            headDiv.style.position = "relative";
                            headDiv.style.zIndex = "99999";
                            var htmlValue = '<div id="waiff" class="waifu" style="pointer-events: none;width:'+ model.canvasWidth * 2+ 'px;height: '+ model.canvasHeight * 2 +'px;';
                            if(isShowModel) {
                                htmlValue += '">'
                            }else {
                                htmlValue += ' display:none;">'
                            }
                       
                            htmlValue += '<div id = "waifu-tips-controller"'
                            if (getQiPao.showHidden === CONSTANTS.SHOW) {
                                htmlValue += '>'
                            } else {
                                htmlValue += ' style="display:none;">';
                            }

                            htmlValue += '<div id = "waifu-tips" class="waifu-tips" style="top:' + model.waifuTop + '"></div></div>';

                            htmlValue += '<canvas id="live2d" ></canvas></div>';
                            headDiv.innerHTML = htmlValue;
                            document.body.appendChild(headDiv);
                            
                            loadlive2d("live2d", model);
                           
                            // var dv=document.getElementById("waiff");
                            // var x=0;var y=0;var l=0;var t=0;
                            // var isDown=false;
                            // dv.onmousedown=function(e){x=e.clientX;
                            // y=e.clientY;
                            // l=dv.offsetLeft;
                            // t=dv.offsetTop;
                            // isDown=true;
                            // dv.style.cursor="move"};
                            // window.onmousemove=function(e){if(isDown==false){return}
                            // var nx=e.clientX;var ny=e.clientY;
                            // var nl=nx-(x-l);
                            // var nt=ny-(y-t);
                            // dv.style.left=nl+"px";dv.style.top=nt+"px"};
                            // dv.onmouseup=function(){isDown=false;dv.style.cursor="default"}

                            })

                        }
                    });

                }
            });
   
    });
});
}



loadOptions(); //To set default value on pop-up button
loadSound();
loadQiPao();

loadIndex();

loadModel();



  chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {

        var opt = request.opt;
        var value = request.value;
        switch(opt) {
            case "setOptions":
            relaodOptions(value);
            break;
            case "setQiPao":
            reloadQiPao(value);
            break;
            case "setIndex":
            relaodIndex(value);
            break;
            case 'setCloseRealmNames':
            document.location.reload();
            break;
            case 'getRealmName':
            sendResponse(window.location.host)
            break;
            default:
        }

	}
);