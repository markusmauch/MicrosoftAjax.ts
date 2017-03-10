module Sys
{
    interface NumberFormat
    {
        CurrencyDecimalDigits: number;
        CurrencyDecimalSeparator: string;
        IsReadOnly: boolean;
        CurrencyGroupSizes: number[];
        NumberGroupSizes: number[];
        PercentGroupSizes: number[];
        CurrencyGroupSeparator: string;
        CurrencySymbol: string;
        NaNSymbol: string;
        CurrencyNegativePattern: number;
        NumberNegativePattern: number;
        PercentPositivePattern: number;
        PercentNegativePattern: number;
        NegativeInfinitySymbol: string;
        NegativeSign: string;
        NumberDecimalDigits: number;
        NumberDecimalSeparator: string;
        NumberGroupSeparator: string,
            CurrencyPositivePattern: number;
        PositiveInfinitySymbol: string;
        PositiveSign: string;
        PercentDecimalDigits: number;
        PercentDecimalSeparator: string;
        PercentGroupSeparator: string;
        PercentSymbol: string;
        PerMilleSymbol: string;
        NativeDigits: string[];
        DigitSubstitution: number;
    }

    interface CalendarFormat
    {
        MinSupportedDateTime: string;
        MaxSupportedDateTime: string;
        AlgorithmType: 1;
        CalendarType: 1;
        Eras: number[];
        TwoDigitYearMax: number;
        IsReadOnly: boolean;
    }

    interface DateTimeFormat
    {
        AMDesignator: string;
        Calendar: CalendarFormat;
        DateSeparator: "/";
        FirstDayOfWeek: 0;
        CalendarWeekRule: 0;
        FullDateTimePattern: string;
        LongDatePattern: string;
        LongTimePattern: string;
        MonthDayPattern: string;
        PMDesignator: string;
        RFC1123Pattern: string;
        ShortDatePattern: string;
        ShortTimePattern: string;
        SortableDateTimePattern: string;
        TimeSeparator: string;
        UniversalSortableDateTimePattern: string;
        YearMonthPattern: string;
        AbbreviatedDayNames: string[];
        ShortestDayNames: string[];
        DayNames: string[];
        AbbreviatedMonthNames: string[];
        MonthNames: string[];
        IsReadOnly: boolean;
        NativeCalendarName: string;
        AbbreviatedMonthGenitiveNames: string[];
        MonthGenitiveNames: string[];
        eras: any[];
    }

    /**
     * Represents a culture definition that can be applied to objects that accept a culture-related setting.
     * @see {@link http://msdn.microsoft.com/en-us/library/bb384004(v=vs.100).aspx}
     */
    export class CultureInfo
    {
        private _dateTimeFormats: string[];
        private _upperMonths: string[];
        private _upperAbbrMonths: string[];
        private _upperDays: string[];
        private _upperAbbrDays: string[];
        private _upperAbbrMonthsGenitive: string[];
        private _upperMonthsGenitive: string[];

        /**
         * Initializes a new instance of the Sys.CultureInfo class.   
         * @param name
         *      The culture value (locale) that represents a language and region.
         * @param numberFormat
         *      A culture-sensitive numeric formatting string.
         * @param dateTimeFormat
         *      A culture-sensitive date formatting string.
         */
        constructor( name: string, numberFormat: NumberFormat, dateTimeFormat: DateTimeFormat )
        {
            this.name = name;
            this.numberFormat = numberFormat;
            this.dateTimeFormat = dateTimeFormat;
        }

        /**
         * Gets the culture value (locale) that represents a language and region.
         * @returns
         *      The culture value (locale) that represents a language and region.
         */
        public name: string;

        /**
         * Gets an object that contains an array of culture-sensitive formatting and parsing strings values that can be applied to Number type extensions. 
         * Use the numberFormat field to retrieve an object that contains an array of formatting strings that are based on the current culture or on the invariant culture. 
         * Each formatting string can be used to specify how to format Number type extensions.
         * @returns
         *      An object that contains an array of culture-sensitive formatting strings.  
         */
        public numberFormat: NumberFormat;

        /**
         * Gets an object that contains an array of culture-sensitive formatting and parsing string values that can be applied to Date type extensions.
         * Use the dateTimeFormat field to retrieve an object that contains an array of formatting strings that are based on the current culture or on the invariant culture. 
         * Each formatting string can be used to specify how to format Date type extensions.
         * @returns
         *      An object that contains an array of culture-sensitive formatting strings.
         */
        public dateTimeFormat: DateTimeFormat;

        public _getDateTimeFormats()
        {
            if ( this._dateTimeFormats === undefined )
            {
                var dtf = this.dateTimeFormat;
                this._dateTimeFormats = [ dtf.MonthDayPattern,
                    dtf.YearMonthPattern,
                    dtf.ShortDatePattern,
                    dtf.ShortTimePattern,
                    dtf.LongDatePattern,
                    dtf.LongTimePattern,
                    dtf.FullDateTimePattern,
                    dtf.RFC1123Pattern,
                    dtf.SortableDateTimePattern,
                    dtf.UniversalSortableDateTimePattern
                ];
            }
            return this._dateTimeFormats;
        }

        private _getIndex( value: string, a1: string[], a2: string[] )
        {
            var upper = this._toUpper( value ),
                i = Array.indexOf( a1, upper );
            if ( i === -1 )
            {
                i = Array.indexOf( a2, upper );
            }
            return i;
        }

        public _getMonthIndex( value: string )
        {
            if ( !this._upperMonths )
            {
                this._upperMonths = this._toUpperArray( this.dateTimeFormat.MonthNames );
                this._upperMonthsGenitive = this._toUpperArray( this.dateTimeFormat.MonthGenitiveNames );
            }
            return this._getIndex( value, this._upperMonths, this._upperMonthsGenitive );
        }

        public _getAbbrMonthIndex( value: string )
        {
            if ( !this._upperAbbrMonths )
            {
                this._upperAbbrMonths = this._toUpperArray( this.dateTimeFormat.AbbreviatedMonthNames );
                this._upperAbbrMonthsGenitive = this._toUpperArray( this.dateTimeFormat.AbbreviatedMonthGenitiveNames );
            }
            return this._getIndex( value, this._upperAbbrMonths, this._upperAbbrMonthsGenitive );
        }

        public _getDayIndex( value: string )
        {
            if ( !this._upperDays )
            {
                this._upperDays = this._toUpperArray( this.dateTimeFormat.DayNames );
            }
            return Array.indexOf( this._upperDays, this._toUpper( value ) );
        }

        public _getAbbrDayIndex( value: string )
        {
            if ( !this._upperAbbrDays )
            {
                this._upperAbbrDays = this._toUpperArray( this.dateTimeFormat.AbbreviatedDayNames );
            }
            return Array.indexOf( this._upperAbbrDays, this._toUpper( value ) );
        }

        private _toUpperArray( arr: string[] )
        {
            var result: string[] = [];
            for ( var i = 0; i < arr.length; i++ )
            {
                result.push( this._toUpper( arr[ i ] ) );
            }
            return result;
        }

        private _toUpper( value: string )
        {
            return value.split( "\u00A0" ).join( ' ' ).toUpperCase();
        }

        /**
         * Gets the globalization values of the invariant culture as sent by the server. This member is static and can be invoked without creating an instance of the class.
         * The InvariantCulture field contains the following fields associated with the invariant (culture-independent) culture: name, dateTimeFormat, and numberFormat.
         * @returns
         *      A CultureInfo object.  
         */
        static get InvariantCulture(): CultureInfo
        {
            return Sys.CultureInfo._parse(
            {
                name: "",
                numberFormat:
                {
                    CurrencyDecimalDigits: 2,
                    CurrencyDecimalSeparator: ".",
                    IsReadOnly: true,
                    CurrencyGroupSizes: [ 3 ],
                    NumberGroupSizes: [ 3 ],
                    PercentGroupSizes: [ 3 ],
                    CurrencyGroupSeparator: ",",
                    CurrencySymbol: "\u00A4",
                    NaNSymbol: "NaN",
                    CurrencyNegativePattern: 0,
                    NumberNegativePattern: 1,
                    PercentPositivePattern: 0,
                    PercentNegativePattern: 0,
                    NegativeInfinitySymbol: "-Infinity",
                    NegativeSign: "-",
                    NumberDecimalDigits: 2,
                    NumberDecimalSeparator: ".",
                    NumberGroupSeparator: ",",
                    CurrencyPositivePattern: 0,
                    PositiveInfinitySymbol: "Infinity",
                    PositiveSign: "+",
                    PercentDecimalDigits: 2,
                    PercentDecimalSeparator: ".",
                    PercentGroupSeparator: ",",
                    PercentSymbol: "%",
                    PerMilleSymbol: "\u2030",
                    NativeDigits: [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ],
                    DigitSubstitution: 1
                },
                dateTimeFormat:
                {
                    AMDesignator: "AM",
                    Calendar:
                    {
                        MinSupportedDateTime: "@-62135568000000@",
                        MaxSupportedDateTime: "@253402300799999@",
                        AlgorithmType: 1,
                        CalendarType: 1,
                        Eras: [ 1 ],
                        TwoDigitYearMax: 2029,
                        IsReadOnly: true
                    },
                    DateSeparator: "/",
                    FirstDayOfWeek: 0,
                    CalendarWeekRule: 0,
                    FullDateTimePattern: "dddd, dd MMMM yyyy HH:mm:ss",
                    LongDatePattern: "dddd, dd MMMM yyyy",
                    LongTimePattern: "HH:mm:ss",
                    MonthDayPattern: "MMMM dd",
                    PMDesignator: "PM",
                    RFC1123Pattern: "ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'",
                    ShortDatePattern: "MM/dd/yyyy",
                    ShortTimePattern: "HH:mm",
                    SortableDateTimePattern: "yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss",
                    TimeSeparator: ":",
                    UniversalSortableDateTimePattern: "yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'",
                    YearMonthPattern: "yyyy MMMM",
                    AbbreviatedDayNames: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
                    ShortestDayNames: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ],
                    DayNames: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
                    AbbreviatedMonthNames: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "" ],
                    MonthNames: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "" ],
                    IsReadOnly: true,
                    NativeCalendarName: "Gregorian Calendar",
                    AbbreviatedMonthGenitiveNames: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "" ],
                    MonthGenitiveNames: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "" ],
                    eras: [ 1, "A.D.", null, 0 ]
                }
            } );
        }

        /**
         * Gets the globalization values of the current culture as sent by the server. This member is static and can be invoked without creating an instance of the class.
         * The CurrentCulture field contains the following fields associated with the current culture: name, dateTimeFormat, and numberFormat.
         * @returns
         *      A Sys.CultureInfo object.
         */
        static get CurrentCulture(): CultureInfo
        {
            if ( Sys.CultureInfo._currentCulture === undefined )
            {
                let ci = window[ "__cultureInfo" ];
                if ( ci !== undefined )
                {
                    Sys.CultureInfo._currentCulture = Sys.CultureInfo._parse( ci );
                    delete window[ "__cultureInfo" ];
                }
                else
                {
                    Sys.CultureInfo._currentCulture = Sys.CultureInfo._parse(
                    {
                        name: "en-US",
                        numberFormat:
                        {
                            CurrencyDecimalDigits: 2,
                            CurrencyDecimalSeparator: ".",
                            IsReadOnly: false,
                            CurrencyGroupSizes: [ 3 ],
                            NumberGroupSizes: [ 3 ],
                            PercentGroupSizes: [ 3 ],
                            CurrencyGroupSeparator: ",",
                            CurrencySymbol: "$",
                            NaNSymbol: "NaN",
                            CurrencyNegativePattern: 0,
                            NumberNegativePattern: 1,
                            PercentPositivePattern: 0,
                            PercentNegativePattern: 0,
                            NegativeInfinitySymbol: "-Infinity",
                            NegativeSign: "-",
                            NumberDecimalDigits: 2,
                            NumberDecimalSeparator: ".",
                            NumberGroupSeparator: ",",
                            CurrencyPositivePattern: 0,
                            PositiveInfinitySymbol: "Infinity",
                            PositiveSign: "+",
                            PercentDecimalDigits: 2,
                            PercentDecimalSeparator: ".",
                            PercentGroupSeparator: ",",
                            PercentSymbol: "%",
                            PerMilleSymbol: "\u2030",
                            NativeDigits: [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" ],
                            DigitSubstitution: 1
                        },
                        dateTimeFormat:
                        {
                            AMDesignator: "AM",
                            Calendar:
                            {
                                MinSupportedDateTime: "@-62135568000000@",
                                MaxSupportedDateTime: "@253402300799999@",
                                AlgorithmType: 1,
                                CalendarType: 1,
                                Eras: [ 1 ],
                                TwoDigitYearMax: 2029,
                                IsReadOnly: false
                            },
                            DateSeparator: "/",
                            FirstDayOfWeek: 0,
                            CalendarWeekRule: 0,
                            FullDateTimePattern: "dddd, MMMM dd, yyyy h:mm:ss tt",
                            LongDatePattern: "dddd, MMMM dd, yyyy",
                            LongTimePattern: "h:mm:ss tt",
                            MonthDayPattern: "MMMM dd",
                            PMDesignator: "PM",
                            RFC1123Pattern: "ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'",
                            ShortDatePattern: "M/d/yyyy",
                            ShortTimePattern: "h:mm tt",
                            SortableDateTimePattern: "yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss",
                            TimeSeparator: ":",
                            UniversalSortableDateTimePattern: "yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'",
                            YearMonthPattern: "MMMM, yyyy",
                            AbbreviatedDayNames: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
                            ShortestDayNames: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ],
                            DayNames: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
                            AbbreviatedMonthNames: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "" ],
                            MonthNames: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "" ],
                            IsReadOnly: false,
                            NativeCalendarName: "Gregorian Calendar",
                            AbbreviatedMonthGenitiveNames: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "" ],
                            MonthGenitiveNames: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "" ],
                            eras: [ 1, "A.D.", null, 0 ]
                        }
                    } );
                }
            }

            return Sys.CultureInfo._currentCulture;
        }

        private static _currentCulture: CultureInfo | undefined;

        public static _parse( value:
        {
            name: string,
            numberFormat: NumberFormat,
            dateTimeFormat: DateTimeFormat
        } )
        {
            return new Sys.CultureInfo( value.name, value.numberFormat, value.dateTimeFormat );
        }
    }
}