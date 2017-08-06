function isOverrideOptionValid(option)
{
	// return (option === OVERRIDE_OPTIONS.ALWAYS || 
	// 	    option === OVERRIDE_OPTIONS.NEW_ONLY ||
	// 	    option === OVERRIDE_OPTIONS.DISABLE);

	return (option === OVERRIDE_OPTIONS.NEW_ONLY ||
		    option === OVERRIDE_OPTIONS.DISABLE);
}

function log(message, messageType)
{
	if(shouldLog === true) 
	{
		switch(messageType)
		{
			case MESSAGE_TYPES.DEBUG:
			{
				console.log(message);
				break;
			}
			case MESSAGE_TYPES.ERROR:
			{
				console.error(message);
				break;
			}
			default:
			{
				console.log(message);
			}
		}
	}
}

function getOverrideOptionFromStorage(callBack)
{
	getStorage(function(items) {
		callBack(items.overrideOption);
	});
}

function saveOverrideOptionToStorage(overrideOption, callBack)
{
	setStorage(STORAGE_KEYS.OVERRIDE_OPTION, overrideOption, function(){
		callBack();
	});
}

function getStorage(callBack)
{
	chrome.storage.sync.get(null, function(items) {
		callBack(items);
	});
}

function setStorage(storageKey, value, callBack)
{
	var key = {};
	key[storageKey] = value;
	
	chrome.storage.sync.set(key, function() {
		callBack();
	});
}