import { CultureInfo, DateTimeFormat } from "Sys/CultureInfo";
import { StringBuilder } from "Sys/StringBuilder";
import { Res } from "Sys/Res";

declare global
{
    interface Date
    {
        /**
         * Formats a date by using the invariant (culture-independent) culture.
         * 
         * @param format
         *       A format string.
         * @returns
         *      A string that contains the formatted date value.
         */
        format( format: string );

        /**
         * Formats a date by using the current culture.
         * 
         * @param format
         *       A format string.
         * @returns
         *      A string that contains the formatted date value.
         */
        localeFormat( format: string ): string;
    }

    interface DateConstructor
    {
        /**
         * Creates a date from a locale-specific string by using the current culture.
         * This function is static and can be invoked without creating an instance of the object.
         * 
         * @param value
         *      A locale-specific string that represents a date.
         * @param formats
         *      (Optional) An array of custom formats.
         * @returns
         *      If value is a valid string representation of a date, an object of type Date; otherwise, null.
         */
        parseLocal( value: string, formats: string[] ): Date | null;

        /**
         * Creates a date from a string by using the invariant culture.
         * This function is static and can be invoked without creating an instance of the object.
         * 
         * @param value
         *      A string that represents a date.
         * @param formats
         *      (Optional) An array of custom formats.
         * @returns
         *      If value is a valid string representation of a date in the invariant format, an object of type Date; otherwise, null.
         */
        parseInvariant( value: string, formats: string[] ): Date | null;

        _parse( value: string, cultureInfo: CultureInfo, args ): Date;

        _parseExact( value: string, format: string, cultureInfo: CultureInfo ): Date;

        _getParseRegExp( dtf: DateTimeFormat, format: string ): { regExp: string, groups: any };

        _getTokenRegExp(): RegExp;

        _appendPreOrPostMatch( preMatch: string, strBuilder: StringBuilder ): number;

        _expandYear( dtf: DateTimeFormat, year: number ): number;

        _getEra( date: Date, eras?: number[] ): number;

        _getEraYear( date: Date, dtf: DateTimeFormat, era: number, sortable?: boolean ): number;

        _expandFormat(dtf: DateTimeFormat, format:string): string;
    }
}

Date.prototype.format = function( format: string )
{
    return "";
}

Date.prototype.localeFormat = function( format: string )
{
    return "";
}

Date.parseLocal = function( value: string, formats: string[] )
{
    return null;
}

Date.parseInvariant = function( value: string, formats: string[] )
{
    return null;
}

Date._parse = function( value: string, cultureInfo: CultureInfo, args )
{
    var i, l, date, format, formats, custom = false;
    for ( i = 1, l = args.length; i < l; i++ )
    {
        format = args[ i ];
        if ( format )
        {
            custom = true;
            date = Date._parseExact( value, format, cultureInfo );
            if ( date ) return date;
        }
    }
    if ( !custom )
    {
        formats = cultureInfo._getDateTimeFormats();
        for ( i = 0, l = formats.length; i < l; i++ )
        {
            date = Date._parseExact( value, formats[ i ], cultureInfo );
            if ( date ) return date;
        }
    }
    return null;
}

Date._parseExact = function( value: string, format: string, cultureInfo: CultureInfo )
{
    value = value.trim();
    var dtf = cultureInfo.dateTimeFormat,
        parseInfo = Date._getParseRegExp( dtf, format ),
        match = new RegExp( parseInfo.regExp ).exec( value );
    if ( match === null ) return null;

    var groups = parseInfo.groups,
        era = null,
        year = null,
        month = null,
        date = null,
        weekDay = null,
        hour = 0,
        hourOffset, min = 0,
        sec = 0,
        msec = 0,
        tzMinOffset = null,
        pmHour = false;
    for ( var j = 0, jl = groups.length; j < jl; j++ )
    {
        var matchGroup = match[ j + 1 ];
        if ( matchGroup )
        {
            switch ( groups[ j ] )
            {
                case 'dd':
                case 'd':
                    date = parseInt( matchGroup, 10 );
                    if ( ( date < 1 ) || ( date > 31 ) ) return null;
                    break;
                case 'MMMM':
                    month = cultureInfo._getMonthIndex( matchGroup );
                    if ( ( month < 0 ) || ( month > 11 ) ) return null;
                    break;
                case 'MMM':
                    month = cultureInfo._getAbbrMonthIndex( matchGroup );
                    if ( ( month < 0 ) || ( month > 11 ) ) return null;
                    break;
                case 'M':
                case 'MM':
                    month = parseInt( matchGroup, 10 ) - 1;
                    if ( ( month < 0 ) || ( month > 11 ) ) return null;
                    break;
                case 'y':
                case 'yy':
                    year = Date._expandYear( dtf, parseInt( matchGroup, 10 ) );
                    if ( ( year < 0 ) || ( year > 9999 ) ) return null;
                    break;
                case 'yyyy':
                    year = parseInt( matchGroup, 10 );
                    if ( ( year < 0 ) || ( year > 9999 ) ) return null;
                    break;
                case 'h':
                case 'hh':
                    hour = parseInt( matchGroup, 10 );
                    if ( hour === 12 ) hour = 0;
                    if ( ( hour < 0 ) || ( hour > 11 ) ) return null;
                    break;
                case 'H':
                case 'HH':
                    hour = parseInt( matchGroup, 10 );
                    if ( ( hour < 0 ) || ( hour > 23 ) ) return null;
                    break;
                case 'm':
                case 'mm':
                    min = parseInt( matchGroup, 10 );
                    if ( ( min < 0 ) || ( min > 59 ) ) return null;
                    break;
                case 's':
                case 'ss':
                    sec = parseInt( matchGroup, 10 );
                    if ( ( sec < 0 ) || ( sec > 59 ) ) return null;
                    break;
                case 'tt':
                case 't':
                    var upperToken = matchGroup.toUpperCase();
                    pmHour = ( upperToken === dtf.PMDesignator.toUpperCase() );
                    if ( !pmHour && ( upperToken !== dtf.AMDesignator.toUpperCase() ) ) return null;
                    break;
                case 'f':
                    msec = parseInt( matchGroup, 10 ) * 100;
                    if ( ( msec < 0 ) || ( msec > 999 ) ) return null;
                    break;
                case 'ff':
                    msec = parseInt( matchGroup, 10 ) * 10;
                    if ( ( msec < 0 ) || ( msec > 999 ) ) return null;
                    break;
                case 'fff':
                    msec = parseInt( matchGroup, 10 );
                    if ( ( msec < 0 ) || ( msec > 999 ) ) return null;
                    break;
                case 'dddd':
                    weekDay = cultureInfo._getDayIndex( matchGroup );
                    if ( ( weekDay < 0 ) || ( weekDay > 6 ) ) return null;
                    break;
                case 'ddd':
                    weekDay = cultureInfo._getAbbrDayIndex( matchGroup );
                    if ( ( weekDay < 0 ) || ( weekDay > 6 ) ) return null;
                    break;
                case 'zzz':
                    var offsets = matchGroup.split( /:/ );
                    if ( offsets.length !== 2 ) return null;
                    hourOffset = parseInt( offsets[ 0 ], 10 );
                    if ( ( hourOffset < -12 ) || ( hourOffset > 13 ) ) return null;
                    var minOffset = parseInt( offsets[ 1 ], 10 );
                    if ( ( minOffset < 0 ) || ( minOffset > 59 ) ) return null;
                    tzMinOffset = ( hourOffset * 60 ) + ( matchGroup.startsWith( '-' ) ? -minOffset : minOffset );
                    break;
                case 'z':
                case 'zz':
                    hourOffset = parseInt( matchGroup, 10 );
                    if ( ( hourOffset < -12 ) || ( hourOffset > 13 ) ) return null;
                    tzMinOffset = hourOffset * 60;
                    break;
                case 'g':
                case 'gg':
                    var eraName = matchGroup;
                    if ( !eraName || !dtf.eras ) return null;
                    eraName = eraName.toLowerCase().trim();
                    for ( var i = 0, l = dtf.eras.length; i < l; i += 4 )
                    {
                        if ( eraName === dtf.eras[ i + 1 ].toLowerCase() )
                        {
                            era = i;
                            break;
                        }
                    }
                    if ( era === null ) return null;
                    break;
            }
        }
    }
    var result = new Date(),
        defaultYear, convert = dtf.Calendar.convert;
    if ( convert )
    {
        defaultYear = convert.fromGregorian( result )[ 0 ];
    }
    else
    {
        defaultYear = result.getFullYear();
    }
    if ( year === null )
    {
        year = defaultYear;
    }
    else if ( dtf.eras )
    {
        year += dtf.eras[ ( era || 0 ) + 3 ];
    }
    if ( month === null )
    {
        month = 0;
    }
    if ( date === null )
    {
        date = 1;
    }
    if ( convert )
    {
        result = convert.toGregorian( year, month, date );
        if ( result === null ) return null;
    }
    else
    {
        result.setFullYear( year, month, date );
        if ( result.getDate() !== date ) return null;
        if ( ( weekDay !== null ) && ( result.getDay() !== weekDay ) )
        {
            return null;
        }
    }
    if ( pmHour && ( hour < 12 ) )
    {
        hour += 12;
    }
    result.setHours( hour, min, sec, msec );
    if ( tzMinOffset !== null )
    {
        var adjustedMin = result.getMinutes() - ( tzMinOffset + result.getTimezoneOffset() );
        result.setHours( result.getHours() + parseInt( ( adjustedMin / 60 ).toString(), 10 ), adjustedMin % 60 );
    }
    return result;
}

Date._getParseRegExp = function( dtf: DateTimeFormat, format: string )
{
    if ( !dtf._parseRegExp )
    {
        dtf._parseRegExp = {};
    }
    else if ( dtf._parseRegExp[ format ] )
    {
        return dtf._parseRegExp[ format ];
    }
    var expFormat = Date._expandFormat( dtf, format );
    expFormat = expFormat.replace( /([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1" );
    var regexp = new StringBuilder( "^" );
    var groups = [];
    var index = 0;
    var quoteCount = 0;
    var tokenRegExp = Date._getTokenRegExp();
    var match;
    while ( ( match = tokenRegExp.exec( expFormat ) ) !== null )
    {
        var preMatch = expFormat.slice( index, match.index );
        index = tokenRegExp.lastIndex;
        quoteCount += Date._appendPreOrPostMatch( preMatch, regexp );
        if ( ( quoteCount % 2 ) === 1 )
        {
            regexp.append( match[ 0 ] );
            continue;
        }
        switch ( match[ 0 ] )
        {
            case 'dddd':
            case 'ddd':
            case 'MMMM':
            case 'MMM':
            case 'gg':
            case 'g':
                regexp.append( "(\\D+)" );
                break;
            case 'tt':
            case 't':
                regexp.append( "(\\D*)" );
                break;
            case 'yyyy':
                regexp.append( "(\\d{4})" );
                break;
            case 'fff':
                regexp.append( "(\\d{3})" );
                break;
            case 'ff':
                regexp.append( "(\\d{2})" );
                break;
            case 'f':
                regexp.append( "(\\d)" );
                break;
            case 'dd':
            case 'd':
            case 'MM':
            case 'M':
            case 'yy':
            case 'y':
            case 'HH':
            case 'H':
            case 'hh':
            case 'h':
            case 'mm':
            case 'm':
            case 'ss':
            case 's':
                regexp.append( "(\\d\\d?)" );
                break;
            case 'zzz':
                regexp.append( "([+-]?\\d\\d?:\\d{2})" );
                break;
            case 'zz':
            case 'z':
                regexp.append( "([+-]?\\d\\d?)" );
                break;
            case '/':
                regexp.append( "(\\" + dtf.DateSeparator + ")" );
                break;
        }
        Array.add( groups, match[ 0 ] );
    }
    Date._appendPreOrPostMatch( expFormat.slice( index ), regexp );
    regexp.append( "$" );
    var regexpStr = regexp.toString().replace( /\s+/g, "\\s+" );
    var parseRegExp = { 'regExp': regexpStr, 'groups': groups };
    dtf._parseRegExp[ format ] = parseRegExp;
    return parseRegExp;
}

Date._getTokenRegExp = function()
{
    return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g;
}

Date._appendPreOrPostMatch = function( preMatch: string, strBuilder: StringBuilder ): number
{
    var quoteCount = 0;
    var escaped = false;
    for ( var i = 0, il = preMatch.length; i < il; i++ )
    {
        var c = preMatch.charAt( i );
        switch ( c )
        {
            case '\'':
                if ( escaped ) strBuilder.append( "'" );
                else quoteCount++;
                escaped = false;
                break;
            case '\\':
                if ( escaped ) strBuilder.append( "\\" );
                escaped = !escaped;
                break;
            default:
                strBuilder.append( c );
                escaped = false;
                break;
        }
    }
    return quoteCount;
}

Date._expandYear = function( dtf: DateTimeFormat, year: number )
{
    var now = new Date(),
        era = Date._getEra( now );
    if ( year < 100 )
    {
        var curr = Date._getEraYear( now, dtf, era );
        year += curr - ( curr % 100 );
        if ( year > dtf.Calendar.TwoDigitYearMax )
        {
            year -= 100;
        }
    }
    return year;
}

Date._getEra = function( date: Date, eras?: number[] )
{
    if ( !eras ) return 0;
    var start, ticks = date.getTime();
    for ( var i = 0, l = eras.length; i < l; i += 4 )
    {
        start = eras[ i + 2 ];
        if ( ( start === null ) || ( ticks >= start ) )
        {
            return i;
        }
    }
    return 0;
}

Date._getEraYear = function( date: Date, dtf: DateTimeFormat, era: number, sortable?: boolean )
{
    var year = date.getFullYear();
    if ( !sortable && dtf.eras )
    {
        year -= dtf.eras[ era + 3 ];
    }
    return year;
}

Date._expandFormat = function(dtf: DateTimeFormat, format:string) {
    if(!format) {
        format = "F";
    }
    var len = format.length;
    if(len === 1) {
        switch(format) {
            case "d":
                return dtf.ShortDatePattern;
            case "D":
                return dtf.LongDatePattern;
            case "t":
                return dtf.ShortTimePattern;
            case "T":
                return dtf.LongTimePattern;
            case "f":
                return dtf.LongDatePattern + " " + dtf.ShortTimePattern;
            case "F":
                return dtf.FullDateTimePattern;
            case "M": case "m":
                return dtf.MonthDayPattern;
            case "s":
                return dtf.SortableDateTimePattern;
            case "Y": case "y":
                return dtf.YearMonthPattern;
            default:
                throw Error.format(Res.formatInvalidString);
        }
    }
    else if((len === 2) && (format.charAt(0) === "%")) {
        format = format.charAt(1);
    }
    return format;
}

export {}
