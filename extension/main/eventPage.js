
log("Event page loaded.", MESSAGE_TYPES.DEBUG);

registerEvents();

function onInit()
{
	log("Initializing.", MESSAGE_TYPES.DEBUG);

	initOptions();
}

function initOptions() 
{
	getOverrideOptionFromStorage(function(currentOverrideOption) {
		if(!isOverrideOptionValid(currentOverrideOption))
		{
			saveOverrideOptionToStorage(defaultOverride, function(){
				log("Override option set to default: " + defaultOverride);
			});
		}
	});
}

function registerEvents()
{
	log("Register onUpdated event.", MESSAGE_TYPES.DEBUG);

	var urlFilter = 
	{
		url: [ {hostContains: '.ebay.'}]
	};

	chrome.webNavigation.onBeforeNavigate.addListener(handleTabUpdate, urlFilter);
	chrome.runtime.onInstalled.addListener(onInit);
}

function handleTabUpdate(event)
{
	var tabId = event.tabId;
	var newUrl = event.url;
	
	log("onBeforeNavigate event received:", MESSAGE_TYPES.DEBUG);
	log("tabId: " + tabId, MESSAGE_TYPES.DEBUG);
	log("newUrl: " + newUrl, MESSAGE_TYPES.DEBUG);

	if(newUrl !== undefined)
	{
		if(tabId !== undefined)
		{
			getOverrideOptionFromStorage(function(currentOverrideOption) {
				processNewUrl(tabId, newUrl, currentOverrideOption);
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
	var urlType = getUrlType(url);

	if(shouldProcessEbayUrl(url, urlType, overrideOption))
	{
		var processedUrl = url;
		var urlChanged = false;

		if(overrideOption === OVERRIDE_OPTIONS.NEW_ONLY)
		{
			log("Location override is enabled: " + overrideOption, MESSAGE_TYPES.DEBUG);

			if(!isOptionAlreadySet(url, EBAY_LOCATION_IDENTIFIER, HOME_LOCATION_VALUE))
			{
				stopLoading(tabId);

				log("Location not set yet: " + url, MESSAGE_TYPES.DEBUG);

				processedUrl = updateOptionInUrl(url, EBAY_LOCATION_IDENTIFIER, HOME_LOCATION_VALUE);

				urlChanged = true;
			}
			else
			{
				log("Location already set, nothing to do: " + url, MESSAGE_TYPES.DEBUG);
			}
		}

		if(true === urlChanged)
		{
			log("Replacing: " + url, MESSAGE_TYPES.DEBUG);
			log("With: " + processedUrl, MESSAGE_TYPES.DEBUG);

			setTabUrl(tabId, processedUrl);
		}
	}
	else
	{
		log("Not processing ebay url: " + url, MESSAGE_TYPES.DEBUG);
	}
}

function shouldProcessEbayUrl(url, urlType, overrideOption)
{
	if(URL_TYPES.EBAY_SEARCH !== urlType && URL_TYPES.EBAY_BROWSE !== urlType)
	{
		log("Ebay url is neither a search nor a browse, nothing to do: " + url, MESSAGE_TYPES.DEBUG);

		return false;
	}

	return true;
}

function getUrlType(url)
{
	var urlType = URL_TYPES.NOT_EBAY;

	if(isEbayUrl(url))
	{
		log("Got an ebay url: " + url, MESSAGE_TYPES.DEBUG);

		urlType = URL_TYPES.EBAY;

		if(isEbaySearchUrl(url))
		{
			log("Ebay url is a search: " + url, MESSAGE_TYPES.DEBUG);

			urlType = URL_TYPES.EBAY_SEARCH;
		}
		else if(isEbayBrowseUrl(url))
		{
			log("Ebay url is a browse: " + url, MESSAGE_TYPES.DEBUG);

			urlType = URL_TYPES.EBAY_BROWSE;
		}
	}
	else
	{
		log("Not an ebay url: " + url, MESSAGE_TYPES.DEBUG);
	}

	return urlType;
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
	return url.indexOf(EBAY_URL_IDENTIFIER) !== -1;
}

function isEbaySearchUrl(url)
{
	return url.indexOf(EBAY_SEARCH_IDENTIFIER) !== -1;
}

function isEbayBrowseUrl(url)
{
	return url.indexOf(EBAY_BROWSE_IDENTIFIER) !== -1;
}

function isOptionValueAlreadySet(url, oprion, value)
{
	return url.indexOf(oprion + SEARCH_EQUAL_DELIMITER + value) !== -1;
}

function isOptionAlreadySet(url, oprion)
{
	return (url.indexOf(oprion + SEARCH_EQUAL_DELIMITER) !== -1) || (url.indexOf(oprion + SEARCH_ADVANCED_EQUAL_DELIMITER) !== -1);
}

function isSearchAlreadySet(url)
{
	return url.indexOf(SEARCH_PRIMARY_DELIMITER) !== -1;
}

function updateOptionInUrl(url, optionIdentifier, value)
{
	var optionIndex = url.indexOf(optionIdentifier);

	if(optionIndex !== -1)
	{
		var nextEqualDelimiterIndex = url.indexOf(SEARCH_EQUAL_DELIMITER, optionIndex + optionIdentifier.length);

		if(nextEqualDelimiterIndex !== -1)
		{
			var nextSearchDelimiterIndex = url.indexOf(SEARCH_SECONDARY_DELIMITER, nextEqualDelimiterIndex + 1);

			var valueToReplace = (nextSearchDelimiterIndex === -1) ? 
				url.substring(nextEqualDelimiterIndex) :
				url.substring(nextEqualDelimiterIndex, nextSearchDelimiterIndex);

			url = url.replace(valueToReplace, value);
		}
	}
	else
	{
		return appendOptionToUrl(url, optionIdentifier, value);
	}

	return url;
}

function setTabUrl(tabId, url)
{
	var updateProperties = {url: url};

	chrome.tabs.update(tabId, updateProperties);
}

function appendOptionToUrl(url, option, value)
{
	if(isSearchAlreadySet(url))
	{
		return url + SEARCH_SECONDARY_DELIMITER + option + SEARCH_EQUAL_DELIMITER + value; 
	}
	else
	{
		return url + SEARCH_PRIMARY_DELIMITER + option + SEARCH_EQUAL_DELIMITER + value;
	}
}