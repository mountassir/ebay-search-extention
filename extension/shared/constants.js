let shouldLog = true;

let OVERRIDE_OPTIONS =
{
	COUNTRY_ONLY: "countryOnlyRadioButton",
	CONTINENT_ONLY: "regionOnlyRadioButton",
	CONTINENTAL_REGION_ONLY: "continentalRegionOnlyRadioButton",
	DISABLE:  "disableRadioButton"
};

let STORAGE_KEYS =
{
	OVERRIDE_OPTION: "overrideOption"
};

let defaultOverride = OVERRIDE_OPTIONS.COUNTRY_ONLY;

let MESSAGE_TYPES =
{
	DEBUG: 0,
	WARN:  1,
	ERROR: 2
};

let URL_TYPES =
{
	NOT_EBAY:    0,
	EBAY:        1,
	EBAY_SEARCH: 2,
	EBAY_BROWSE: 3
};

let EBAY_URL_IDENTIFIER = "www.ebay.";
let EBAY_SEARCH_IDENTIFIER = "/sch/";
let EBAY_BROWSE_IDENTIFIER = "/bn_";
let EBAY_LOCATION_IDENTIFIER = "LH_PrefLoc";
let COUNTRY_LOCATION_VALUE = "1";
let CONTINENT_LOCATION_VALUE = "3";
let CONTINENT_REGION_LOCATION_VALUE = "6";
let SEARCH_SECONDARY_DELIMITER = "&";
let SEARCH_EQUAL_DELIMITER = "=";
let SEARCH_ADVANCED_EQUAL_DELIMITER = "%";
let SEARCH_PRIMARY_DELIMITER = "?";