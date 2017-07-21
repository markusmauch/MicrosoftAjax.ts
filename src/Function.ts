interface FunctionConstructor
{
    /**
     * Creates a delegate function that retains the context initially used during an objects creation.
     * @param instance
     *
     * @param method
     *
     * @returns
     *      The delegate function.
     */
    createDelegate( instance: any, method: Function ): Function;

    /**
     * A function that does nothing.
     */
    emptyMethod: () => void;
}

interface Function
{
    getName(): string;

    /**
     * Returns a value that indicates whether an object is an instance of this Type or of one of it's parent Types.
     * @param instance
     *      The object to test.
     * @returns
     *      true if instance is an instance of this Type or of one of it's parent Types; false if instance does not implement the interface, or if it is undefined or null.
     * @example
     *      let component = new Sys.Component();
     *      let control = new Sys.UI.Control( document.body );
     *      Sys.Component.isInstanceOfType( component ); // true
     *      Sys.Component.isInstanceOfType( control ); // true
     *      Sys.UI.Control.isInstanceOfType( component ); // false
     *      Sys.UI.Control.isInstanceOfType( control ); // true
     *
     */
    isInstanceOfType( instance: any ): boolean;

    implementsInterface( interfaceType: Function ): boolean;

    /**
     * Determines whether this Type inherits from a specified Type.
     * @param parentType
     *      The fully qualified name of the Type to test as a base class for the current Type.
     * @returns
     *      true if this Type inherits from parentType; otherwise, false.
     * @example
     *    Sys.Component.inheritsFrom( Sys.Component ); // false
     *    Sys.Component.inheritsFrom( Sys.UI.Control ); // false
     *    Sys.UI.Control.inheritsFrom( Sys.Component ); // true
     *    Sys.UI.Control.inheritsFrom( Sys.UI.Control ); // false
     */
    inheritsFrom( parentType: Function ): boolean;
}

Function.createDelegate = ( instance: any, method: Function ) =>
{
    return function()
    {
        return method.apply( instance, arguments );
    }
}

Function.emptyMethod = () => {};

Function.prototype.getName = function()
{
    return Object.getTypeName( this );
}

Function.prototype.isInstanceOfType = function( instance: any )
{
    return instance instanceof this;
}

Function.prototype.implementsInterface = function( interfaceType: Function )
{
    return this instanceof interfaceType;
}

Function.prototype.inheritsFrom = function( parentType: Function )
{
    return this.prototype instanceof parentType;
}

let Type = Function;