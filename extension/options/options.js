log("Settings page loaded.", MESSAGE_TYPES.DEBUG);

function setOverrideOption(overrideOption) 
{
	if (!isOverrideOptionValid(overrideOption)) 
	{
		overrideOption = defaultOverride;

		saveOverrideOptionToStorage(overrideOption, function(){
			log("Override option set to default: " + overrideOption);
		});
	}

	setWidgetChecked(overrideOption, true);
}

function initOptions() 
{
	getOverrideOptionFromStorage(function(currentOverrideOption) {
		setOverrideOption(currentOverrideOption);
	});
}

function saveOptions()
{
	let overrideOption = getSelectedOverrideOption();

	if(isOverrideOptionValid(overrideOption))
	{
		let optionKey = {};
		optionKey[STORAGE_KEYS.OVERRIDE_OPTION] = overrideOption;
		
		chrome.storage.sync.set(optionKey, function() {
			let status = document.getElementById('status');
			status.textContent = 'Options saved.';
			setTimeout(function() { status.textContent = ''; }, 750);
		});
	}
	else
	{
		log("Got an invalid option, not saving: " + overrideOption, MESSAGE_TYPES.ERROR);
	}
}

function getSelectedOverrideOption()
{
	if(isWidgetChecked(OVERRIDE_OPTIONS.COUNTRY_ONLY))
	{
		return OVERRIDE_OPTIONS.COUNTRY_ONLY;
	}

	if(isWidgetChecked(OVERRIDE_OPTIONS.CONTINENT_ONLY))
	{
		return OVERRIDE_OPTIONS.CONTINENT_ONLY;
	}

	if(isWidgetChecked(OVERRIDE_OPTIONS.CONTINENTAL_REGION_ONLY))
	{
		return OVERRIDE_OPTIONS.CONTINENTAL_REGION_ONLY;
	}

	if(isWidgetChecked(OVERRIDE_OPTIONS.DISABLE))
	{
		return OVERRIDE_OPTIONS.DISABLE;
	}
}

function isWidgetChecked(widgetId)
{
	let widget = document.getElementById(widgetId);

	return (widget !== undefined && widget.checked === true)
}

function setWidgetChecked(widgetId, checked)
{
	let widget = document.getElementById(widgetId);

	if(widget !== undefined)
	{
		widget.checked = (typeof(checked) === "boolean") ? checked : false;
	}
}

document.addEventListener('DOMContentLoaded', initOptions);
document.getElementById(OVERRIDE_OPTIONS.COUNTRY_ONLY).addEventListener('click', saveOptions);
document.getElementById(OVERRIDE_OPTIONS.CONTINENT_ONLY).addEventListener('click', saveOptions);
document.getElementById(OVERRIDE_OPTIONS.CONTINENTAL_REGION_ONLY).addEventListener('click', saveOptions);
document.getElementById(OVERRIDE_OPTIONS.DISABLE).addEventListener('click',  saveOptions);
