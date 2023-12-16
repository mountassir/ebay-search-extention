
importScripts('../shared/utils.js');
importScripts('../shared/constants.js');

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

	let urlFilter = 
	{
		url: [ {hostContains: '.ebay.'}]
	};

	chrome.webNavigation.onBeforeNavigate.addListener(handleTabUpdate, urlFilter);
	chrome.runtime.onInstalled.addListener(onInit);
}

function handleTabUpdate(event)
{
	let tabId = event.tabId;
	let newUrl = event.url;
	
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
	if(overrideOption === OVERRIDE_OPTIONS.DISABLE)
	{
		log("Location override is disabled, nothing to do here.", MESSAGE_TYPES.DEBUG);
	}
	else
	{
		log("Location override is enabled: " + overrideOption, MESSAGE_TYPES.DEBUG);

		let urlType = getUrlType(url);

		if(shouldProcessEbayUrl(url, urlType))
		{
			let processedUrl = url;
			let urlChanged = false;

			if(overrideOption === OVERRIDE_OPTIONS.COUNTRY_ONLY)
			{
				if(!optionInUrlNeedsUpdating(url, EBAY_LOCATION_IDENTIFIER, COUNTRY_LOCATION_VALUE))
				{
					log("Location not set yet: " + url, MESSAGE_TYPES.DEBUG);

					stopLoading(tabId);

					processedUrl = updateOptionInUrl(url, EBAY_LOCATION_IDENTIFIER, COUNTRY_LOCATION_VALUE);

					urlChanged = true;
				}
				else
				{
					log("Location already set, nothing to do: " + url, MESSAGE_TYPES.DEBUG);
				}
			}

			if(overrideOption === OVERRIDE_OPTIONS.CONTINENT_ONLY)
			{
				if(!optionInUrlNeedsUpdating(url, EBAY_LOCATION_IDENTIFIER, CONTINENT_LOCATION_VALUE))
				{
					log("Location not set yet: " + url, MESSAGE_TYPES.DEBUG);

					stopLoading(tabId);

					processedUrl = updateOptionInUrl(url, EBAY_LOCATION_IDENTIFIER, CONTINENT_LOCATION_VALUE);

					urlChanged = true;
				}
				else
				{
					log("Location already set, nothing to do here: " + url, MESSAGE_TYPES.DEBUG);
				}
			}

			if(overrideOption === OVERRIDE_OPTIONS.CONTINENTAL_REGION_ONLY)
			{
				if(!optionInUrlNeedsUpdating(url, EBAY_LOCATION_IDENTIFIER, CONTINENT_REGION_LOCATION_VALUE))
				{
					log("Location not set yet: " + url, MESSAGE_TYPES.DEBUG);

					stopLoading(tabId);

					processedUrl = updateOptionInUrl(url, EBAY_LOCATION_IDENTIFIER, CONTINENT_REGION_LOCATION_VALUE);

					urlChanged = true;
				}
				else
				{
					log("Location already set, nothing to do here: " + url, MESSAGE_TYPES.DEBUG);
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
}

function updateOptionInUrl(url, optionIdentifier, value)
{
	//Example URL /sch/i.html?_from=R40&_nkw=gtx&_sacat=0&LH_PrefLoc=3&rt=nc&_oaa=1
	let optionIndex = url.indexOf(optionIdentifier);

	//Example URL /sch/i.html?_from=R40&_nkw=gtx&_sacat=0&LH_PrefLoc=3&rt=nc&_oaa=1
    //                                optionIndex---------^          

	if(optionIndex !== -1)
	{
		//If a location option is already set, we have to update it
		let nextEqualDelimiterIndex = url.indexOf(SEARCH_EQUAL_DELIMITER, optionIndex + optionIdentifier.length);

		//Example URL /sch/i.html?_from=R40&_nkw=gtx&_sacat=0&LH_PrefLoc=3&rt=nc&_oaa=1
        //                                optionIndex---------^         ^  
        //                                nextEqualDelimiterIndex(=)----^ 

		if(nextEqualDelimiterIndex !== -1)
		{
			let nextSearchDelimiterIndex = url.indexOf(SEARCH_SECONDARY_DELIMITER, nextEqualDelimiterIndex + 1);

			//Example URL /sch/i.html?_from=R40&_nkw=gtx&_sacat=0&LH_PrefLoc=3&rt=nc&_oaa=1
	        //                                optionIndex---------^         ^ ^ 
	        //                                nextEqualDelimiterIndex"="----^ ^
	        //                                nextSearchDelimiterIndex"&"-----^

			let valueToReplace = (nextSearchDelimiterIndex === -1) ? 
				url.substring(optionIndex) :
				url.substring(optionIndex, nextSearchDelimiterIndex);

			//Example URL /sch/i.html?_from=R40&_nkw=gtx&_sacat=0&LH_PrefLoc=3&rt=nc&_oaa=1
			//                                                   |------------|  
	        //We replace the value between optionIndex and nextSearchDelimiterIndex, "LH_PrefLoc=3" in this example.

			url = url.replace(valueToReplace, optionIdentifier + SEARCH_EQUAL_DELIMITER + value);
		}
	}
	else
	{
		//If no location option was set, we can just append it to the URL
		return appendOptionToUrl(url, optionIdentifier, value);
	}

	return url;
}

function getUrlType(url)
{
	let urlType = URL_TYPES.NOT_EBAY;

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

function setTabUrl(tabId, url)
{
	let updateProperties = {url: url};

	chrome.tabs.update(tabId, updateProperties);
}

function stopLoading(tabId) 
{
	log("Stopping tabId: " + tabId + " from loading.", MESSAGE_TYPES.DEBUG);

/*
	let script = 
	{
        code: "window.stop();",
        runAt: "document_start"
	};

    chrome.tabs.executeScript(tabId, script);
*/
    setTabUrl(tabId, "");
}

function shouldProcessEbayUrl(url, urlType)
{
	if(URL_TYPES.EBAY_SEARCH !== urlType && URL_TYPES.EBAY_BROWSE !== urlType)
	{
		log("Ebay url is neither a search nor a browse, nothing to do: " + url, MESSAGE_TYPES.DEBUG);

		return false;
	}

	return true;
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

function optionInUrlNeedsUpdating(url, oprion, value)
{
	return isOptionAlreadySetInUrl(url, oprion) || isAdvancedSearch(url, oprion);
}

function isOptionAlreadySetInUrl(url, oprion)
{
	return url.indexOf(oprion + SEARCH_EQUAL_DELIMITER) !== -1;
}

function isOptionValueAlreadySetInUrl(url, oprion, value)
{
	return url.indexOf(oprion + SEARCH_EQUAL_DELIMITER + value) !== -1;
}

function isAdvancedSearch(url, oprion)
{
	return url.indexOf(oprion + SEARCH_ADVANCED_EQUAL_DELIMITER) !== -1;
}

function isAnySearchASetInUrl(url)
{
	return url.indexOf(SEARCH_PRIMARY_DELIMITER) !== -1;
}

function appendOptionToUrl(url, option, value)
{
	if(isAnySearchASetInUrl(url))
	{
		return url + SEARCH_SECONDARY_DELIMITER + option + SEARCH_EQUAL_DELIMITER + value; 
	}
	else
	{
		return url + SEARCH_PRIMARY_DELIMITER + option + SEARCH_EQUAL_DELIMITER + value;
	}
}