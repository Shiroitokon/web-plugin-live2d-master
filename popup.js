var CONSTANTS = {
    ENABLE: 'Enable',
    DISABLE: 'Disable',
    HIDDEN: 'Hidden',
    SHOW: 'Show',
    OPEN: 'Open',
    CLOSE: 'Close'
};


function init() {
    var list = [];
    $.ajaxSettings.async = false;
    $.getJSON('lib/model-data-2.0.json', function (data) {
        list = data;
    });
    for (var i = 0; i < list.length; i++) {
        var tag;
        var name = list[i].name;
        if (i == 0) {
            tag = '<li><input id="tag' + i + '" name="tag" type="radio" value="' + i + '"checked="true" /> ' + name + ' </li>';
        } else {
            tag = '<li><input id="tag' + i + '" name="tag" type="radio" value="' + i + '" /> ' + name + ' </li>';
        }
        $("#indexUl").append(tag);
    }
}

init();

// 设置radio点击事件
var chlids = document.querySelectorAll('input[name="tag"]');
for (var i = 0; i < chlids.length; i++) {
    chlids[i].addEventListener('click', function () {
        var index = $('input:radio[name="tag"]:checked').val();
        chrome.extension.sendMessage({name: 'setIndex', status: index}, function () {
        });
    })
}


chrome.extension.sendMessage({name: 'getOptions'}, function (response) {
    var inputValue = response.enableDisable === CONSTANTS.ENABLE ? "关闭插件" : "开启插件";
    document.getElementById('isKai').value = inputValue;
});


    chrome.tabs.query({active: true, currentWindow: true},  function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {opt: "getRealmName"},  function(response) {
            var realmName = response;

            chrome.extension.sendMessage({name: 'getCloseRealmNames', realmName: realmName}, function (res) { 
                console.log(res)
                if(res) {
                    document.getElementById('closeRealmName').value = "取消屏蔽域名"
                    return;
                }
                document.getElementById('closeRealmName').value = "屏蔽当前域名"

            });

       
        });
       });


chrome.extension.sendMessage({name: 'getIndex'}, function (response) {
    $("#tag" + response.index).attr("checked", "true")
});

chrome.extension.sendMessage({name: 'getQiPao'}, function (response) {
    console.log(response)
	var inputValue = response.showHidden === CONSTANTS.SHOW ? "隐藏气泡" : "显示气泡";
    document.getElementById('isPao').value = inputValue;
});

chrome.extension.sendMessage({name: 'getSound'}, function (response) {
    console.log(response.openClose)
	var inputValue = response.openClose === CONSTANTS.OPEN ? "关闭声音" : "开启声音";
    document.getElementById('isOpenSound').value = inputValue;
});

document.querySelector('#isKai').addEventListener('click', function () {
    if (document.getElementById('isKai').value === "开启插件") {
        // save to localstore
        chrome.extension.sendMessage({name: 'setOptions', status: CONSTANTS.ENABLE}, function () {
        });
        document.getElementById('isKai').value = "关闭插件";
    } else if (document.getElementById('isKai').value === "关闭插件") {
        // save to localstore
        chrome.extension.sendMessage({name: 'setOptions', status: CONSTANTS.DISABLE}, function () {
        });
        document.getElementById('isKai').value = "开启插件";
    }
});

document.querySelector('#isPao').addEventListener('click', function () {
    if (document.getElementById('isPao').value === "显示气泡") {
        // save to localstore
        chrome.extension.sendMessage({name: 'setQiPao', status: CONSTANTS.SHOW}, function () {
        });
        document.getElementById('isPao').value = "隐藏气泡";
    } else if (document.getElementById('isPao').value === "隐藏气泡") {
        // save to localstore
        chrome.extension.sendMessage({name: 'setQiPao', status: CONSTANTS.HIDDEN}, function () {
        });
        document.getElementById('isPao').value = "显示气泡";
    }
});


document.querySelector('#isOpenSound').addEventListener('click', function () {
    console.log(document.getElementById('isOpenSound').value)
    if (document.getElementById('isOpenSound').value === "开启声音") {
        // save to localstore
        chrome.extension.sendMessage({name: 'setSound', status: CONSTANTS.OPEN}, function () {
        });
        document.getElementById('isOpenSound').value = "关闭声音";
    } else if (document.getElementById('isOpenSound').value === "关闭声音") {
        // save to localstore
        chrome.extension.sendMessage({name: 'setSound', status: CONSTANTS.CLOSE}, function () {
        });
        document.getElementById('isOpenSound').value = "开启声音";
    }
});


document.querySelector('#closeRealmName').addEventListener('click', function () {
 
    chrome.tabs.query({active: true, currentWindow: true},  function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {opt: "getRealmName"},  function(response) {
            var realmName = response;
            console.log(realmName)
            if(realmName ==null || realmName == undefined || realmName == '') {
                return;
            }
         
            if(document.getElementById('closeRealmName').value === "屏蔽当前域名") {
                document.getElementById('closeRealmName').value = "取消屏蔽域名"
                chrome.extension.sendMessage({name: 'addCloseRealmName', realmName: realmName}, function () {});
                chrome.tabs.sendMessage(tabs[0].id, {opt: "setCloseRealmNames"},  function(response){})
            }else {
                document.getElementById('closeRealmName').value = "屏蔽当前域名"
                chrome.extension.sendMessage({name: 'removeCloseRealmName', realmName: realmName}, function () {});
                chrome.tabs.sendMessage(tabs[0].id, {opt: "setCloseRealmNames"},  function(response){})
            }
        });
       });

   
});







