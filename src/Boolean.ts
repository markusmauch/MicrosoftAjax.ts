interface BooleanConstructor
{
    /**
     * Converts a string representation of a logical value to its Boolean object equivalent.
     * This function is static and can be invoked without creating an instance of the object.
     *
     * @param value
     *      A string representation of true or false.
     * @returns
     *      A Boolean value (true or false) that corresponds to the value argument.
     */
    parse( value: string ): boolean;
}

Boolean.parse = ( value: string ) =>
{
    let v = value.trim().toLowerCase();
    if ( v === "false" ) return false;
    if ( v === "true" ) return true;
    throw Error.argumentOutOfRange( "value", value, Sys.Res.boolTrueOrFalse );
}