interface ArrayConstructor
{
    /**
     * Adds an element to the end of an Array object. This function is static and is invoked without creating an instance of the object.
     * @param array
     *      The array to add the item to.
     * @param item
     *      The object to add to the array.
     */
    add <T>( array: T[], item: T ): void;

    /**
     * Copies all the elements of a specified Array object to the end of the array. This function is static and can be invoked without creating an instance of the object.
     * @param array
     *      The array to add items to.
     * @param items
     *      The array of items to append.
     */
    addRange <T>( array: T[], items: T[] ): void;

    /**
     * Removes all elements from an Array instance. This function is static and is invoked without creating an instance of the object.
     * @param array
     *      The array to clear.
     */
    clear <T>( attay: T[] ): void;

    /**
     * Creates a shallow copy of an Array object. This function is static and can be invoked without creating an instance of the object.
     * @param array
     *      The array to create a shallow copy of.
     */
    clone <T>( array: T[] ): T[];

    /**
     * Determines whether the specified object exists as an element in an Array object. This function is static and can be invoked without creating an instance of the object.
     * @param array
     *      The array to search.
     * @param item
     *      The object to find in the array.
     */
    contains <T>( array: T[], item: T ): boolean;

    /**
     * Removes the first element from the specified Array object and returns it.
     * @param array
     *      The array to remove the first element from.
     */
    dequeue <T>( array: T[] ): void;

    /**
     * Adds the specified object to the end of an Array object. This function is static and is invoked without creating an instance of the object.
     * @param array
     *      The array to add item to.
     * @param item
     *      The object to add to the end of the array.
     */
    enqueue <T>( array: T[], item: T ): void;

    /**
     * Calls a specified function for each element of an Array object. This function is static and can be invoked without creating an instance of the object.
     * @param array
     *      The Array object to enumerate.
     * @param callback
     *      The function to call for each element in the array.
     * @param context
     *      The context for calling method.
     */
    forEach < T, C > ( array: T[], callback: ( context: C, item: T, index: number, array: T[] ) => void, context: C ): void;

    /**
     * Searches for the specified element of an Array object and returns it's index. This function is static and can be invoked without creating an instance of the object.
     * @param array
     *      The array to search.
     * @param item
     *      The object to find in the array.
     * @param startIndex
     *      (Optional) The index number that specifies the starting element for searching the array.
     */
    indexOf <T>( array: T[], item: T, startIndex ? : number ): number;

    /**
     * Inserts a single item into a specified index of an Array object. This function is static and can be invoked without creating an instance of the object.
     * @param array
     *      The array to insert the item into.
     * @param index
     *      The index location where item should be inserted.
     * @param item
     *      The object to add to the array.
     */
    insert <T>( array: T[], index: number, item: T ): void;

    /**
     * Creates an array from a string representation. This function is static and can be invoked without creating an instance of the object.
     * @param value
     *      The string to convert to an array.
     */
    parse <T>( value ? : string ): T[];

    /**
     * Removes the first occurrence of the specified item from an Array object. This function is static and can be invoked without creating an instance of the object.
     * @param array
     *      The array to remove item from.
     * @param item
     *      The object to remove from the array at the first occurrence.
     * @returns
     *      true if the specified item exists as element in the array and was removed; otherwise, false.
     */
    remove <T>( array: T[], item: T ): boolean;


    /**
     * Removes an element from of an Array object at a specified index location. This function is static and can be invoked without creating an instance of the object.
     * @param array
     *      The array to remove the element from.
     * @param index
     *      The index of the element to remove from the array.
     */
    removeAt <T>( array: T[], index: number ): void;
}

Array.add = <T>( array: T[], item: T ) =>
{
    array[ array.length ] = item;
}

Array.addRange = <T>( array: T[], items: T[] ) =>
{
    array.push.apply( array, items );
}

Array.clear = <T>( array: T[] ) =>
{
    array.length = 0;
}

Array.clone = <T>( array: T[] ) =>
{
    if ( array.length === 1 )
    {
        return [ array[ 0 ] ];
    }
    else
    {
        return Array.apply( null, array );
    }
};

Array.contains = <T>( array: T[], item: T ) =>
{
    return array.indexOf( item ) !== -1;
}

Array.dequeue = <T>( array: T[] ) =>
{
    return array.shift();
}

Array.enqueue = Array.add;

Array.forEach = < T, C > ( array: T[], callback: ( context: C, item: T, index: number, array: T[] ) => void, context: C ) =>
{
    for ( let i = 0, l = array.length; i < l; i++ )
    {
        let elt = array[ i ];
        if ( elt !== undefined ) callback.apply( context, [ elt, i, array ] );
    }
}

Array.indexOf = <T>( array: T[], item: T, startIndex = 0 ) =>
{
    var rest = array.slice( startIndex );
    return rest.indexOf( item );
}

Array.insert = <T>( array: T[], index: number, item: T ) =>
{
    array.splice( index, 0, item );
}

Array.parse = <T>( value ? : string ) =>
{
    if ( value === undefined ) return [];
    let v = eval( value );
    if ( !Array.isInstanceOfType( v ) ) throw Error.argument( "value", Sys.Res.arrayParseBadFormat );
    return v;
}

Array.remove = <T>( array: T[], item: T ) =>
{
    let index = array.indexOf( item );
    if ( index >= 0 )
    {
        array.splice( index, 1 );
    }
    return ( index >= 0 );
}

Array.removeAt = <T>( array: T[], index: number ) =>
{
    array.splice( index, 1 );
}