function isOverrideOptionValid(option)
{
	return (option === OVERRIDE_OPTIONS.ALWAYS || 
		    option === OVERRIDE_OPTIONS.NEW_ONLY ||
		    option === OVERRIDE_OPTIONS.DISABLE);
}