
log("Event page loaded.", MESSAGE_TYPES.DEBUG);

chrome.runtime.onInstalled.addListener(onInit);

initOptions();
registerEvents();

function onInit()
{
	log("onInstall event received.", MESSAGE_TYPES.DEBUG);

	//registerEvents();
}

function initOptions() 
{
	chrome.storage.sync.get('overrideOption', function(items) {
		log("Override option set to: " + items.overrideOption);
	});
}

function registerEvents()
{
	log("Register onUpdated event.", MESSAGE_TYPES.DEBUG);

	chrome.tabs.onUpdated.addListener(handleTabUpdate);
}

function handleTabUpdate(id, changeInfo, tab)
{
	var tabId = (id !== undefined) ? id : tab.id;
	var status = changeInfo.status;
	var newUrl = changeInfo.url;

	log("onUpdated event received:", MESSAGE_TYPES.DEBUG);
	log("tabId: " + tabId, MESSAGE_TYPES.DEBUG);
	log("status: " + status, MESSAGE_TYPES.DEBUG);
	log("newUrl: " + newUrl, MESSAGE_TYPES.DEBUG);
	log("tabUrl: " + tab.url, MESSAGE_TYPES.DEBUG);

	if(newUrl !== undefined)
	{
		if(tabId !== undefined)
		{
			chrome.storage.sync.get("overrideOption", function(items) {
				var overrideOption = items.overrideOption;
				processNewUrl(tabId, newUrl, overrideOption);
			});
		}
		else
		{
			log("Invalid taId:" + tabId, MESSAGE_TYPES.ERROR);
		}
	}
	else
	{
		log("url has not changed, nothing to do.", MESSAGE_TYPES.DEBUG);
	}
}

function processNewUrl(tabId, url, overrideOption)
{
	if(shouldProcessEbayUrl(url, overrideOption))
	{
		stopLoading(tabId);

		var noLocationUrl = clearLocationInUrl(url);
		var homeOnlyUrl = addHomeOnlyToEbayUrl(noLocationUrl);

		log("Replacing: " + url, MESSAGE_TYPES.DEBUG);
		log("With: " + homeOnlyUrl, MESSAGE_TYPES.DEBUG);

		setTabUrl(tabId, homeOnlyUrl);
	}
	else
	{
		log("Not processing ebay url: " + url, MESSAGE_TYPES.DEBUG);
	}
}

function shouldProcessEbayUrl(url, overrideOption)
{
	if(overrideOption === OVERRIDE_OPTIONS.ALWAYS || 
	   overrideOption === OVERRIDE_OPTIONS.NEW_ONLY)
	{
		log("Location override is enabled: " + overrideOption, MESSAGE_TYPES.DEBUG);
	}
	else
	{
		log("Location override is disabled: " + overrideOption, MESSAGE_TYPES.DEBUG);

		return false;
	}

	if(isEbayUrl(url))
	{
		log("Got an ebay url: " + url, MESSAGE_TYPES.DEBUG);
	}
	else
	{
		log("Not an ebay url, nothing to do: " + url, MESSAGE_TYPES.DEBUG);

		return false;
	}

	if(isSearchUrl(url))
	{
		log("Ebay url is a search: " + url, MESSAGE_TYPES.DEBUG);
	}
	else
	{
		log("Ebay url is not a search, nothing to do: " + url, MESSAGE_TYPES.DEBUG);

		return false;
	}

	if(!isAlreadyProcessed(url, overrideOption))
	{
		log("Location not set yet: " + url, MESSAGE_TYPES.DEBUG);
	}
	else
	{
		log("Location already set, nothing to do: " + url, MESSAGE_TYPES.DEBUG);

		return false;
	}

	return true;
}

function stopLoading(tabId) 
{
	log("Stopping tabId: " + tabId + " from loading.", MESSAGE_TYPES.DEBUG);

	var script = 
	{
        code: "window.stop();",
        runAt: "document_start"
	};

    chrome.tabs.executeScript(tabId, script);
}

function isEbayUrl(url)
{
	return url.indexOf(getEbayUrlIdentifier()) !== -1;
}

function isSearchUrl(url)
{
	return url.indexOf(getEbaySearchIdentifier()) !== -1;
}

function isAlreadyProcessed(url, overrideOption)
{
	if(overrideOption === OVERRIDE_OPTIONS.ALWAYS)
	{
		return url.indexOf(getEbayHomeLocationIdentifier()) !== -1;
	}
	
	return url.indexOf(getEbayLocationIdentifier()) !== -1;
}

function clearLocationInUrl(url)
{
	var locationtParameterAt = url.indexOf(getEbayLocationIdentifier());

	while(locationtParameterAt !== -1)
	{
		var nextParameterAt = url.indexOf(SEARCH_OPTIONS_DELIMITER, locationtParameterAt + 1);

		var foundLocationPref = (nextParameterAt === -1) ? 
			url.substring(locationtParameterAt) :
			url.substring(locationtParameterAt, nextParameterAt);

		url = url.replace(foundLocationPref, "");

		locationtParameterAt = url.indexOf(getEbayLocationIdentifier());
	}

	return url;
}

function addHomeOnlyToEbayUrl(url)
{
	return url + getEbayHomeLocationIdentifier();
}

function setTabUrl(tabId, url)
{
	var updateProperties = {url: url};

	chrome.tabs.update(tabId, updateProperties);
}

function getEbayUrlIdentifier()
{
	return "www.ebay.";
}

function getEbaySearchIdentifier()
{
	return "/sch/";
}

function getEbayLocationIdentifier()
{
	return "&LH_PrefLoc=";
}

function getEbayHomeLocationIdentifier()
{
	return getEbayLocationIdentifier() + HOME_LOCATION_VALUE;
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