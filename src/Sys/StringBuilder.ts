
class StringBuilder
{
    private _parts: string[];
    private _value: { [key: string]: string };
    private _len: number;

    /**
     * Creates a new instance of StringBuilder and optionally accepts initial text to concatenate.
     * @param initialText
     *      (Optional) The string that is used to initialize the value of the instance.
     *      If the value is null, the new StringBuilder instance will contain an empty string ("").
     */
    constructor( initialText?: string )
    {
        this._parts =
            ( initialText !== undefined && initialText !== null && initialText !== "" ) ?
            [ initialText.toString() ] :
            [];
        this._value = {};
        this._len = 0;
    }

    /**
     * Appends a copy of a specified string to the end of the {@link Sys.StringBuilder} instance.
     * @param text
     *      The string to append to the end of the StringBuilder instance.
     */
    public append( text: string )
    {
        this._parts[ this._parts.length ] = text;
    }

    /**
     * Appends a string with a line terminator to the end of the {@link Sys.StringBuilder} instance.
     * @param text
     *      (Optional) The string to append with a line terminator to the end of the StringBuilder instance.
     */
    public appendLine( text: string )
    {
        this._parts[ this._parts.length ] = ( text === undefined || text === null || text === "" ) ?
            "\r\n" :
            text + "\r\n";
    }

    /**
     * Clears the contents of the Sys.StringBuilder instance.
     */
    public clear()
    {
        this._parts = [];
        this._value = {};
        this._len = 0;
    }

    /**
     * Determines whether the {@link Sys.StringBuilder} object has content.
     * @returns
     *      true if the StringBuilder instance contains no elements; otherwise, false.
     */
    public isEmpty()
    {
        if ( this._parts.length === 0 ) return true;
        return this.toString() === "";
    }

    /**
     * Creates a string from the contents of a {@link Sys.StringBuilder} instance, and optionally inserts a delimiter between each element of the created string.
     * @param separator
     *      (Optional) A string to append between each element of the string that is returned.
     * @returns
     *      A string representation of the StringBuilder instance. If separator is specified, the delimiter string is inserted between each element of the returned string.
     */
    public toString( separator?: string )
    {
        separator = separator || "";
        let parts = this._parts;
        if ( this._len !== parts.length )
        {
            this._value = {};
            this._len = parts.length;
        }
        let val = this._value;
        if ( val[ separator ] === undefined )
        {
            if ( separator !== '' )
            {
                for ( let i = 0; i < parts.length; )
                {
                    if ( ( parts[ i ] === undefined ) || ( parts[ i ] === '' ) || ( parts[ i ] === null ) )
                    {
                        parts.splice( i, 1 );
                    }
                    else
                    {
                        i++;
                    }
                }
            }
            val[ separator ] = this._parts.join( separator );
        }
        return val[ separator ];
    }
}

export { StringBuilder }

