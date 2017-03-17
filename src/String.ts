
import { Res } from "Sys/Res"
import { FormattableObject } from "FormattableObject";

type FormatArgument = string | FormattableObject | CustomFormatObject;
type CustomFormatObject = { toFormattedString: ( value: string ) => string; };

declare global
{
    interface String
    {
        /**
         * Determines whether the start of a String object matches a specified string.
         *
         * @param prefix
         *      The string to match with the start of the String object.
         * @returns
         *      true if the start of the String object matches prefix; otherwise, false.
         */
        startsWith( prefix: string): boolean;

        /**
         * Determines whether the end of a String object matches a specified string.
         * 
         * @param suffix
         *      The string to match with the end of the String object.
         * @returns
         *      true  if the end of the String object matches suffix; otherwise, false.
         */
        endsWith( suffix: string ): boolean;

        /**
         * Removes leading and trailing white-space characters from a String object.
         * 
         * @returns
         *      A copy of the string with all white-space characters removed from the start and end of the string.
         */
        //trim(): string; // exists in ES5

        /**
         * Removes trailing white-space characters from a String object.
         * 
         * @returns
         *      A copy of the string with all white-space characters removed from the end of the string.
         */
        trimEnd(): string;

        /**
         * Removes leading white-space characters from a String object.
         * 
         * @returns
         *      A copy of the string with all white-space characters removed from the start of the string.
         */
        trimStart(): string;
        
    }

    interface StringConstructor
    {
        /**
         * Replaces each format item in a String object with the text equivalent of a corresponding object's value.
         * 
         * @param format
         *      A format string.
         * @param args
         *      An array of objects to format.
         * @returns
         *      A copy of the string with the formatting applied.
         */
        format( format: string, ...args: FormatArgument[] ): string;
        
        /**
         * Replaces the format items in a String object with the text equivalent of a corresponding object's value.
         * The current culture is used to format dates and numbers.
         * 
         * @param format
         *      A format string.
         * @param args
         *      An array of objects to format.
         * @returns
         *      A copy of the string with the formatting applied.
         */
        localeFormat( format: string, ...args: FormatArgument[] ): string;

        _toFormattedString( useLocale: boolean, format: string, args: FormatArgument[] ): string;
    }
}

String.prototype.startsWith = function( prefix: string )
{
    return ( this.substr( 0, prefix.length ) === prefix );
}

String.prototype.endsWith = function( suffix: string)
{
    return ( this.substr( this.length - suffix.length ) === suffix );
}

String.prototype.trimEnd = function()
{
    return this.trimRight();
}

String.prototype.trimStart = function()
{
    return this.trimLeft();
}

String.format = ( format: string, ...args: FormatArgument[] ) =>
{
    return String._toFormattedString( false, format, args );
}

String.localeFormat = ( format: string, ...args: FormatArgument[] ) =>
{
    return String._toFormattedString( true, format, args );
}

String._toFormattedString = ( useLocale: boolean, format: string, args: FormatArgument[] ) =>
{
    var result = "";
    for (var i = 0;;)
    {
        var open = format.indexOf( '{', i );
        var close = format.indexOf( '}', i );
        if ( (open < 0) && (close < 0) )
        {
            result += format.slice( i );
            break;
        }
        if ( ( close > 0 ) && ( ( close < open ) || ( open < 0 ) ) )
        {
            if (format.charAt(close + 1) !== '}')
            {
                throw Error.argument('format', Res.stringFormatBraceMismatch);
            }
            result += format.slice( i, close + 1 );
            i = close + 2;
            continue;
        }
        result += format.slice( i, open );
        i = open + 1;
        if ( format.charAt( i ) === '{' )
        {
            result += '{';
            i++;
            continue;
        }
        if ( close < 0 ) 
        {
            throw Error.argument('format', Res.stringFormatBraceMismatch);
        }
        let brace = format.substring( i, close );
        let colonIndex = brace.indexOf( ":" );
        let argNumber = parseInt( ( colonIndex < 0 )
            ? brace
            : brace.substring( 0, colonIndex ), 10 );
        if ( isNaN( argNumber ) ) 
            throw Error.argument( "format", Res.stringFormatInvalid );
        let argFormat = ( colonIndex < 0 )
            ? ''
            : brace.substring( colonIndex + 1 );
        let arg = args[ argNumber ];
        if ( arg === undefined || arg === null )
        {
            arg = "";
        }
        if ( ( <CustomFormatObject>arg ).toFormattedString )
        {
            result += ( <CustomFormatObject>arg ).toFormattedString( argFormat );
        }
        else
        if ( useLocale && ( <FormattableObject>arg ).localeFormat )
        {
            result += ( <FormattableObject>arg ).localeFormat( argFormat );
        }
        else if ( ( <FormattableObject>arg ).format )
        {
            result += ( <FormattableObject>arg ).format( argFormat );
        }
        else 
        {
            result += arg.toString();
        }
        i = close + 1;
    }
    return result;
}

export {};
