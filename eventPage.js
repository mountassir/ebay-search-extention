
var log = false;

if(log === true) console.log("Event page loaded.");

chrome.runtime.onInstalled.addListener(onInit);

registerEvents();

function onInit()
{
	if(log === true) console.log("onInstall event received.");

	//registerEvents();
}

function registerEvents()
{
	if(log === true) console.log("Register onUpdated event.");

	chrome.tabs.onUpdated.addListener(handleTabUpdate);
}

function handleTabUpdate(id, changeInfo, tab)
{
	var tabId = (id !== undefined) ? id : tab.id;
	var status = changeInfo.status;
	var newUrl = changeInfo.url;

	if(log === true) 
	{
		console.log("onUpdated event received:");
		console.log("tabId: ", tabId);
		console.log("status: ", status);
		console.log("newUrl: ", newUrl);
		console.log("tabUrl: ", tab.url);
	}

	if(newUrl !== undefined)
	{
		if(tabId !== undefined)
		{
			processNewUrl(tabId, newUrl);
		}
		else
		{
			if(log === true) console.error("Invalid taId:", tabId);
		}
	}
	else
	{
		if(log === true) console.log("url has not changed, nothing to do.");
	}
}

function processNewUrl(tabId, url)
{
	if(shouldProcessEbayUrl(url))
	{
		stopLoading(tabId);

		var homeOnlyUrl = addHomeOnlyToEbayUrl(url);

		if(log === true) 
		{
			console.log("Replacing: ", url);
			console.log("With: ", homeOnlyUrl);
		}
		setTabUrl(tabId, homeOnlyUrl);
	}
	else
	{
		if(log === true) console.log("Not processing ebay url: ", url);
	}
}

function shouldProcessEbayUrl(url)
{
	if(isEbayUrl(url))
	{
		if(log === true) console.log("Got an ebay url: ", url);
	}
	else
	{
		if(log === true) console.log("Not an ebay url, nothing to do: ", url);

		return false;
	}

	if(isSearchUrl(url))
	{
		if(log === true) console.log("Ebay url is a search: ", url);
	}
	else
	{
		if(log === true) console.log("Ebay url is not a search, nothing to do: ", url);

		return false;
	}

	if(!isAlreadyProcessed(url))
	{
		if(log === true) console.log("Location not set yet: ", url);
	}
	else
	{
		if(log === true) console.log("Location already set, nothing to do: ", url);

		return false;
	}

	return true;
}

function stopLoading(tabId) 
{
	if(log === true) console.log("Stopping tabId: ", tabId, " from loading.");

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

function isAlreadyProcessed(url)
{
	return url.indexOf(getEbayLocationIdentifier()) !== -1;
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

function addHomeOnlyToEbayUrl(url)
{
	return url + getEbayLocationIdentifier() + "1";
}

function setTabUrl(tabId, url)
{
	var updateProperties = {url: url};

	chrome.tabs.update(tabId, updateProperties);
}