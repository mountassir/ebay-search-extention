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

var URL_TYPES =
{
	NOT_EBAY:    0,
	EBAY:        1,
	EBAY_SEARCH: 2,
	EBAY_BROWSE: 3
};

var EBAY_URL_IDENTIFIER = "www.ebay.";
var EBAY_SEARCH_IDENTIFIER = "/sch/";
var EBAY_BROWSE_IDENTIFIER = "/bn_";
var EBAY_BLOCATION_IDENTIFIER = "LH_PrefLoc";
var HOME_LOCATION_VALUE = "1";
var SEARCH_SECONDARY_DELIMITER = "&";
var SEARCH_EQUAL_DELIMITER = "=";
var SEARCH_PRIMARY_DELIMITER = "?";