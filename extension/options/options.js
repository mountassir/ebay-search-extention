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
	var overrideOption = getSelectedOverrideOption();

	if(isOverrideOptionValid(overrideOption))
	{
		var optionKey = {};
		optionKey[STORAGE_KEYS.OVERRIDE_OPTION] = overrideOption;
		
		chrome.storage.sync.set(optionKey, function() {
			var status = document.getElementById('status');
			status.textContent = 'Options saved.';
			setTimeout(function() { status.textContent = ''; }, 750);
		});
	}
}

function getSelectedOverrideOption()
{
	// if(isWidgetChecked(OVERRIDE_OPTIONS.ALWAYS))
	// {
	// 	return OVERRIDE_OPTIONS.ALWAYS;
	// }

	if(isWidgetChecked(OVERRIDE_OPTIONS.NEW_ONLY))
	{
		return OVERRIDE_OPTIONS.NEW_ONLY;
	}

	if(isWidgetChecked(OVERRIDE_OPTIONS.DISABLE))
	{
		return OVERRIDE_OPTIONS.DISABLE;
	}
}

function isWidgetChecked(widgetId)
{
	var widget = document.getElementById(widgetId);

	return (widget !== undefined && widget.checked === true)
}

function setWidgetChecked(widgetId, checked)
{
	var widget = document.getElementById(widgetId);

	if(widget !== undefined)
	{
		widget.checked = (typeof(checked) === "boolean") ? checked : false;
	}
}

document.addEventListener('DOMContentLoaded', initOptions);
//document.getElementById(OVERRIDE_OPTIONS.ALWAYS).addEventListener('click',   saveOptions);
document.getElementById(OVERRIDE_OPTIONS.NEW_ONLY).addEventListener('click', saveOptions);
document.getElementById(OVERRIDE_OPTIONS.DISABLE).addEventListener('click',  saveOptions);
