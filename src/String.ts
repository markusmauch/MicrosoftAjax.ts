
import { Res } from "./Sys/Res"

declare global
{
    interface String
    {
        format( ...args: String[] ): string;
        localeFormat( ...args: String[] ): string;
        
        /**
         * Determines whether the start of a String object matches a specified string.
         * @param prefix
         *      The string to match with the start of the String object.
         * @returns
         *      true if the start of the String object matches prefix; otherwise, false.
         */
        startsWith( prefix: string): boolean;
    }

    interface StringConstructor
    {
        /**
         * Replaces each format item in a String object with the text equivalent of a corresponding object's value. 
         * @param format
         *      A format string.
         * @param args
         *      An array of objects to format.
         */
        format( format: string, ...args: String[] ): string;
        
        /**
         * Replaces the format items in a String object with the text equivalent of a corresponding object's value. The current culture is used to format dates and numbers.
         * @param format
         *      A format string.
         * @param args
         *      An array of objects to format.
         */
        localeFormat( format: string, ...args: String[] ): string;
        
        _toFormattedString( useLocale: boolean, args: String[] ): string;
    }
}

function StringExtensions()
{
    String.prototype.format = function( ...args: String[] )
    {
        return String.format( this, ...args );
    }

    String.prototype.localeFormat = function( ...args: String[] )
    {
        return String.localeFormat( this, ...args );
    }

    String.prototype.startsWith = function( prefix: string)
    {
        return ( this.substr( 0, prefix.length ) === prefix );
    }

    String.format = ( format: string, ...args: String[] ) =>
    {
        return String._toFormattedString( false, args );
    }

    String.localeFormat = ( format: string, ...args: String[] ) =>
    {
        return String._toFormattedString( true, args );
    }

    String._toFormattedString = ( useLocale: boolean, args: String[] ) =>
    {
        var result = "";
        var format = args[0];
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
                : brace.substring( 0, colonIndex ), 10 ) + 1;
            if ( isNaN( argNumber ) ) 
                throw Error.argument( "format", Res.stringFormatInvalid );
            let argFormat = ( colonIndex < 0 )
                ? ''
                : brace.substring( colonIndex + 1 );
            let arg = args[ argNumber ];
            if ( typeof( arg ) === "undefined" || arg === null )
            {
                arg = '';
            }
            // if ( arg.toFormattedString )
            // {
            //     result += arg.toFormattedString( argFormat );
            // }
            //else
            if ( useLocale && arg.localeFormat )
            {
                result += arg.localeFormat( argFormat );
            }
            else if ( arg.format )
            {
                result += arg.format( argFormat );
            }
            else 
            {
                result += arg.toString();
            }
            i = close + 1;
        }
        return result;
    }
}


export { StringExtensions };
