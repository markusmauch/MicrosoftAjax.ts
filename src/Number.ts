import { CultureInfo, NumberFormat } from "Sys/CultureInfo"
import { Res } from "Sys/Res"
import { FormattableObject } from "FormattableObject";

declare global
{
    interface Number extends FormattableObject
    {
    }

    interface NumberConstructor
    {
        /**
         * Creates a numeric value from a locale-specific string.
         * 
         * @param value
         *      A string that represents a number.
         * @returns
         *     An object of type Number. 
         */
        parseLocale( value: string ): number;

        /**
         * Returns a numeric value from a string representation of a number. This function is static and can be called without creating an instance of the object.
         * 
         * @param value
         *      A string that represents a whole or floating-point number.
         * @returns
         *      A floating-point representation of value, if value represents a number; otherwise, NaN (not a number).
         */
        parseInvariant( value: string ): number;

        _parse( value: string, cultureInfo: CultureInfo ): number;

        _parseNumberNegativePattern( value: string, numFormat: NumberFormat, numberNegativePattern: number ): string[];
    }
}

Number.prototype.format = function( format: string )
{
    return this._toFormattedString( format, CultureInfo.InvariantCulture );
}

Number.prototype.localeFormat = function( format: string )
{
    return this._toFormattedString( format, CultureInfo.CurrentCulture );
}

Number.prototype._toFormattedString = function( format: string, cultureInfo: CultureInfo )
{
    if ( !format || ( format.length === 0 ) || ( format === 'i' ) )
    {
        if ( cultureInfo && ( cultureInfo.name.length > 0 ) )
        {
            return this.toLocaleString();
        }
        else
        {
            return this.toString();
        }
    }

    var _percentPositivePattern = [ "n %", "n%", "%n" ];
    var _percentNegativePattern = [ "-n %", "-n%", "-%n" ];
    var _numberNegativePattern = [ "(n)", "-n", "- n", "n-", "n -" ];
    var _currencyPositivePattern = [ "$n", "n$", "$ n", "n $" ];
    var _currencyNegativePattern = [ "($n)", "-$n", "$-n", "$n-", "(n$)", "-n$", "n-$", "n$-", "-n $", "-$ n", "n $-", "$ n-", "$ -n", "n- $", "($ n)", "(n $)" ];

    function zeroPad( str, count, left )
    {
        for ( var l = str.length; l < count; l++ )
        {
            str = ( left ? ( '0' + str ) : ( str + '0' ) );
        }
        return str;
    }

    let expandNumber = ( number: number, precision: number, groupSizes: number[], sep: string, decimalChar: string ) =>
    {
        var curSize = groupSizes[ 0 ];
        var curGroupIndex = 1;
        var factor = Math.pow( 10, precision );
        var rounded = ( Math.round( number * factor ) / factor );
        if ( !isFinite( rounded ) )
        {
            rounded = number;
        }
        number = rounded;

        var numberString = number.toString();
        var right = "";
        var exponent;

        var split = numberString.split( /e/i );
        numberString = split[ 0 ];
        exponent = ( split.length > 1 ? parseInt( split[ 1 ] ) : 0 );
        split = numberString.split( '.' );
        numberString = split[ 0 ];
        right = split.length > 1 ? split[ 1 ] : "";

        var l;
        if ( exponent > 0 )
        {
            right = zeroPad( right, exponent, false );
            numberString += right.slice( 0, exponent );
            right = right.substr( exponent );
        }
        else if ( exponent < 0 )
        {
            exponent = -exponent;
            numberString = zeroPad( numberString, exponent + 1, true );
            right = numberString.slice( -exponent, numberString.length ) + right;
            numberString = numberString.slice( 0, -exponent );
        }
        if ( precision > 0 )
        {
            if ( right.length > precision )
            {
                right = right.slice( 0, precision );
            }
            else
            {
                right = zeroPad( right, precision, false );
            }
            right = decimalChar + right;
        }
        else
        {
            right = "";
        }
        var stringIndex = numberString.length - 1;
        var ret = "";
        while ( stringIndex >= 0 )
        {
            if ( curSize === 0 || curSize > stringIndex )
            {
                if ( ret.length > 0 )
                {
                    return parseInt( numberString.slice( 0, stringIndex + 1 ) + sep + ret + right );
                }
                else
                {
                    return parseInt( numberString.slice( 0, stringIndex + 1 ) + right );
                }
            }
            if ( ret.length > 0 )
                ret = numberString.slice( stringIndex - curSize + 1, stringIndex + 1 ) + sep + ret;
            else
                ret = numberString.slice( stringIndex - curSize + 1, stringIndex + 1 );
            stringIndex -= curSize;
            if ( curGroupIndex < groupSizes.length )
            {
                curSize = groupSizes[ curGroupIndex ];
                curGroupIndex++;
            }
        }
        return parseInt( numberString.slice( 0, stringIndex + 1 ) + sep + ret + right );
    }
    var nf = cultureInfo.numberFormat;
    var number = Math.abs( this );
    if ( !format )
        format = "D";
    var precision = -1;
    if ( format.length > 1 ) precision = parseInt( format.slice( 1 ), 10 );
    var pattern;
    switch ( format.charAt( 0 ) )
    {
        case "d":
        case "D":
            pattern = 'n';
            if ( precision !== -1 )
            {
                number = zeroPad( "" + number, precision, true );
            }
            if ( this < 0 ) number = -number;
            break;
        case "c":
        case "C":
            if ( this < 0 ) pattern = _currencyNegativePattern[ nf.CurrencyNegativePattern ];
            else pattern = _currencyPositivePattern[ nf.CurrencyPositivePattern ];
            if ( precision === -1 ) precision = nf.CurrencyDecimalDigits;
            number = expandNumber( Math.abs( this ), precision, nf.CurrencyGroupSizes, nf.CurrencyGroupSeparator, nf.CurrencyDecimalSeparator );
            break;
        case "n":
        case "N":
            if ( this < 0 ) pattern = _numberNegativePattern[ nf.NumberNegativePattern ];
            else pattern = 'n';
            if ( precision === -1 ) precision = nf.NumberDecimalDigits;
            number = expandNumber( Math.abs( this ), precision, nf.NumberGroupSizes, nf.NumberGroupSeparator, nf.NumberDecimalSeparator );
            break;
        case "p":
        case "P":
            if ( this < 0 ) pattern = _percentNegativePattern[ nf.PercentNegativePattern ];
            else pattern = _percentPositivePattern[ nf.PercentPositivePattern ];
            if ( precision === -1 ) precision = nf.PercentDecimalDigits;
            number = expandNumber( Math.abs( this ) * 100, precision, nf.PercentGroupSizes, nf.PercentGroupSeparator, nf.PercentDecimalSeparator );
            break;
        default:
            throw Error.format( Res.formatBadFormatSpecifier );
    }
    var regex = /n|\$|-|%/g;
    var ret = "";
    for ( ;; )
    {
        var index = regex.lastIndex;
        var ar = regex.exec( pattern );
        ret += pattern.slice( index, ar ? ar.index : pattern.length );
        if ( !ar )
            break;
        switch ( ar[ 0 ] )
        {
            case "n":
                ret += number;
                break;
            case "$":
                ret += nf.CurrencySymbol;
                break;
            case "-":
                if ( /[1-9]/.test( number.toString() ) )
                {
                    ret += nf.NegativeSign;
                }
                break;
            case "%":
                ret += nf.PercentSymbol;
                break;
        }
    }
    return ret;
}

Number.parseLocale = function( value: string )
{
    return Number._parse( value, CultureInfo.CurrentCulture );
}

Number.parseInvariant = function( value: string )
{
    return Number._parse( value, CultureInfo.InvariantCulture );
}

Number._parse = function( value: string, cultureInfo: CultureInfo )
{
    value = value.trim();

    if ( value.match( /^[+-]?infinity$/i ) )
    {
        return parseFloat( value );
    }
    if ( value.match( /^0x[a-f0-9]+$/i ) )
    {
        return parseInt( value );
    }
    var numFormat = cultureInfo.numberFormat;
    var signInfo = Number._parseNumberNegativePattern( value, numFormat, numFormat.NumberNegativePattern );
    var sign = signInfo[ 0 ];
    var num = signInfo[ 1 ];

    if ( ( sign === '' ) && ( numFormat.NumberNegativePattern !== 1 ) )
    {
        signInfo = Number._parseNumberNegativePattern( value, numFormat, 1 );
        sign = signInfo[ 0 ];
        num = signInfo[ 1 ];
    }
    if ( sign === '' ) sign = '+';

    var exponent;
    var intAndFraction;
    var exponentPos = num.indexOf( 'e' );
    if ( exponentPos < 0 ) exponentPos = num.indexOf( 'E' );
    if ( exponentPos < 0 )
    {
        intAndFraction = num;
        exponent = null;
    }
    else
    {
        intAndFraction = num.substr( 0, exponentPos );
        exponent = num.substr( exponentPos + 1 );
    }

    var integer;
    var fraction;
    var decimalPos = intAndFraction.indexOf( numFormat.NumberDecimalSeparator );
    if ( decimalPos < 0 )
    {
        integer = intAndFraction;
        fraction = null;
    }
    else
    {
        integer = intAndFraction.substr( 0, decimalPos );
        fraction = intAndFraction.substr( decimalPos + numFormat.NumberDecimalSeparator.length );
    }

    integer = integer.split( numFormat.NumberGroupSeparator ).join( '' );
    var altNumGroupSeparator = numFormat.NumberGroupSeparator.replace( /\u00A0/g, " " );
    if ( numFormat.NumberGroupSeparator !== altNumGroupSeparator )
    {
        integer = integer.split( altNumGroupSeparator ).join( '' );
    }

    var p = sign + integer;
    if ( fraction !== null )
    {
        p += '.' + fraction;
    }
    if ( exponent !== null )
    {
        var expSignInfo = Number._parseNumberNegativePattern( exponent, numFormat, 1 );
        if ( expSignInfo[ 0 ] === '' )
        {
            expSignInfo[ 0 ] = '+';
        }
        p += 'e' + expSignInfo[ 0 ] + expSignInfo[ 1 ];
    }
    if ( p.match( /^[+-]?\d*\.?\d*(e[+-]?\d+)?$/ ) )
    {
        return parseFloat( p );
    }
    return Number.NaN;
}

Number._parseNumberNegativePattern = function( value: string, numFormat: NumberFormat, numberNegativePattern: number )
{
    var neg = numFormat.NegativeSign;
    var pos = numFormat.PositiveSign;
    switch ( numberNegativePattern )
    {
        case 4:
            neg = ' ' + neg;
            pos = ' ' + pos;
        case 3:
            if ( value.endsWith( neg ) )
            {
                return [ '-', value.substr( 0, value.length - neg.length ) ];
            }
            else if ( value.endsWith( pos ) )
            {
                return [ '+', value.substr( 0, value.length - pos.length ) ];
            }
            break;
        case 2:
            neg += ' ';
            pos += ' ';
        case 1:
            if ( value.startsWith( neg ) )
            {
                return [ '-', value.substr( neg.length ) ];
            }
            else if ( value.startsWith( pos ) )
            {
                return [ '+', value.substr( pos.length ) ];
            }
            break;
        case 0:
            if ( value.startsWith( '(' ) && value.endsWith( ')' ) )
            {
                return [ '-', value.substr( 1, value.length - 2 ) ];
            }
            break;
    }
    return [ '', value ];
}

export {}
