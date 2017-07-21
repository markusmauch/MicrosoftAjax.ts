interface FormattableObject
{
    /**
     * Formats an object by using the invariant (culture-independent) culture.
     *
     * @param format
     *       A format string.
     * @returns
     *      A string that contains the formatted value.
     */
    format( format: string );

    /**
     * Formats an object by using the current culture.
     *
     * @param format
     *       A format string.
     * @returns
     *      A string that contains the formatted  value.
     */
    localeFormat( format: string ): string;

    _toFormattedString( format: string, cultureInfo: Sys.CultureInfo ): string;

    toFormattedString: ( format: string ) => string;
}