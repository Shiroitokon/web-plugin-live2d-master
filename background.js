var CONSTANTS = {
    ENABLE: 'Enable',
    DISABLE: 'Disable',
    HIDDEN: 'Hidden',
    SHOW: 'Show',
    OPEN: 'Open',
    CLOSE: 'Close'
};


function setItem(key,value){
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key,value);
}

function getItem(key){
    var value;
    try{
        value = window.localStorage.getItem(key);
    }catch (e) {
        value = 'null';
    }
    return value;
}



function getDataModel() {
	var list = [];
	$.ajaxSettings.async = false;
	$.getJSON('lib/model-data-2.0.json', function (data) {
		list = data;
	});

	return list;
}


// Listeners
 chrome.extension.onMessage.addListener(
	 function(request, sender, sendResponse) {
		switch(request.name) {
		case 'setOptions':
			// request from the content script to set the options.
			//localStorage['enableStatus'] = enableStatus;
			localStorage.setItem('enableStatus', request.status);
			sendToScript_Content({opt: "setOptions", value: request.status});
			break;
		case 'getOptions':
			// request from the content script to get the options.
			sendResponse({
				enableDisable: localStorage.enableStatus
			});
			break;
		case 'setIndex':
			localStorage.setItem('index', request.status);
			sendToScript_Content({opt: "setIndex", value: request.status});
			break;
		case 'getIndex':
			sendResponse({
				index: localStorage.index
			});
			break;
		case 'getDataModel':
			var list = getDataModel();
			sendResponse(list);
			break;
		case 'setQiPao':
				localStorage.setItem('qipao', request.status);
				sendToScript_Content({opt: "setQiPao", value: request.status});
				break;
		case 'getQiPao':
				sendResponse({
					showHidden: localStorage.qipao
				});
				break;
		case 'setSound':
				localStorage.setItem('sound', request.status);
				break;		
		case 'getSound':
				sendResponse({
					openClose: localStorage.sound
				});
				break;
		case 'getCloseRealmNames':
				var realmName = request.realmName;
				sendResponse(localStorage.getItem('closeRealmNames_' + realmName))
				break;
		case 'removeCloseRealmName':
				var realmName = request.realmName;
				localStorage.removeItem('closeRealmNames_' + realmName);
				sendResponse({});
				break;
		case 'addCloseRealmName' :
				var realmName = request.realmName;
			
				if(realmName ==null || realmName == undefined || realmName == '') {
					break;
				}
				localStorage.setItem('closeRealmNames_' + realmName, true)
				sendResponse({});
			break;			
		default:
			sendResponse({});
		}
	}
);


function sendToScript_Content(msg) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
		 });
		});
}
