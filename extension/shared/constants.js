var shouldLog = true;

var OVERRIDE_OPTIONS =
{
	COUNTRY_ONLY: "countryOnlyRadioButton",
	REGION_ONLY: "regionOnlyRadioButton",
	DISABLE:  "disableRadioButton"
};

var STORAGE_KEYS =
{
	OVERRIDE_OPTION: "overrideOption"
};

var defaultOverride = OVERRIDE_OPTIONS.COUNTRY_ONLY;

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
var EBAY_LOCATION_IDENTIFIER = "LH_PrefLoc";
var COUNTRY_LOCATION_VALUE = "1";
var REGION_LOCATION_VALUE = "3";
var SEARCH_SECONDARY_DELIMITER = "&";
var SEARCH_EQUAL_DELIMITER = "=";
var SEARCH_ADVANCED_EQUAL_DELIMITER = "%";
var SEARCH_PRIMARY_DELIMITER = "?";