var shouldLog = true;

var OVERRIDE_OPTIONS =
{
	ALWAYS:   "alwaysRadioButton",
	NEW_ONLY: "newOnlyRadioButton",
	DISABLE:  "disableRadioButton"
};

var STORAGE_KEYS =
{
	OVERRIDE_OPTION: "overrideOption"
};

var defaultOverride = OVERRIDE_OPTIONS.NEW_ONLY;

var MESSAGE_TYPES =
{
	DEBUG: 0,
	WARN:  1,
	ERROR: 2
};

var HOME_LOCATION_VALUE = "1";
var SEARCH_OPTIONS_DELIMITER = "&";