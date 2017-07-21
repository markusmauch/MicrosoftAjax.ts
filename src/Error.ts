interface ErrorInfo
{
    [name: string]: string;
}

interface ErrorConstructor
{
    /**
     * Creates an {@link Error} object that represents the {@link Sys.ArgumentException} exception.
     * @param paramName
     *      (Optional) The name of the parameter as a string that caused the exception. The value can be null.
     * @param message
     *      (Optional) An error message string. If message is null, a default message is used.
     * @returns
     *      An Error object that has name and paramName fields added to the Error type definition.
     */
    argument( paramName?: any, message?: string): Error;

    /**
     * Creates an Error object that represents the Sys.ArgumentNullException exception.
     * @param paramName
     *      (Optional) The name of the parameter as a string that caused the exception. If paramName is null, a default message is used.
     * @param message
     *      (Optional) An error message string. The value can be null.
     * @returns
     *      An Error object that has name and paramName fields added to the Error type definition.
     */
    argumentNull( paramName?: string, message?: string ): Error;

    /**
     * Creates an Error object that represents the Sys.ArgumentOutOfRangeException exception.
     * @param paramName
     *      (Optional) The name of the parameter that caused the exception. The value can be null.
     * @param actualValue
     *      (Optional) The value of the parameter that caused the exception. The value can be null.
     * @param message
     *      (Optional) An error message string. The value can be null. If message is null, a default message is used.
     */
    argumentOutOfRange( paramName?: string, actualValue?: any, message?: string  ): Error;

    /**
     * Creates an Error object that can contain additional error information.
     * @param message
     *      (Optional)An error message string
     * @param errorInfo
     *      (Optional) An instance of a JavaScript object that contains extended information about the error.
     *      The object must have a name field that contains a string that identifies the error. The object can also contain fields to fully describe the error.
     * @returns
     *      An Error object.
     */
    create( message?: string, errorInfo?: ErrorInfo ): Error;

    /**
     * Creates an Error object that represents the Sys.FormatException exception.
     * @param message
     *      (Optional) An error message string. The value can be null. If message is null, a default message is used.
     */
    format( message?: string ): Error;

    /**
     * Creates an Error object that represents the {@link Sys.InvalidOperationException} exception.
     * @param message
     *      (Optional) An error message string. The value can be null. If message is null, a default message is used.
     * @returns
     *      An Error object that has a name field added to the Error type definition.
     */
    invalidOperation( message: string | null ): Error;

    /**
     * Creates an Error object that represents the Sys.NotImplementedException exception.
     * @param message
     *      (Optional) An error message string. The value can be null. If message is null, a default message is used.
     */
    notImplemented( message?: string ): Error;
}

interface Error
{
    /**
     * Updates the fileName and lineNumber properties of an Error instance to indicate where the error was thrown instead of where the error was created.
     * Use this function if you are creating custom error types.
     */
    popStackFrame(): void;
}

Error.argument = ( paramName?: any, message?: string ) =>
{
    let displayMessage = "Sys.ArgumentException: " + ( message ? message : Sys.Res.argument );
    if ( paramName )
    {
        displayMessage += "\n" + String.format( Sys.Res.paramName, paramName );
    }
    let err = Error.create( displayMessage, { name: "Sys.ArgumentException", paramName: paramName } );
    err.popStackFrame();
    return err;
}

Error.argumentNull = ( paramName?: string, message?: string ) =>
{
    let displayMessage = "Sys.ArgumentNullException: " + ( message ? message : Sys.Res.argumentNull );
    if ( paramName )
    {
        displayMessage += "\n" + String.format( Sys.Res.paramName, paramName );
    }
    let err = Error.create( displayMessage, { name: "Sys.ArgumentNullException", paramName: paramName || "" } );
    err.popStackFrame();
    return err;
}

Error.argumentOutOfRange = ( paramName?: string, actualValue?: any, message?: string  ) =>
{
    let displayMessage = "Sys.ArgumentOutOfRangeException: " + ( message ? message : Sys.Res.argumentOutOfRange );
    if ( paramName )
    {
        displayMessage += "\n" + String.format( Sys.Res.paramName, paramName );
    }
    if ( typeof( actualValue ) !== "undefined" && actualValue !== null )
    {
        displayMessage += "\n" + String.format( Sys.Res.actualValue, actualValue );
    }
    let err = Error.create(
        displayMessage, {
            name: "Sys.ArgumentOutOfRangeException",
            paramName: paramName || "",
            actualValue: actualValue || ""
        } );
    err.popStackFrame();
    return err;
}

Error.create = ( message?: string, errorInfo?: ErrorInfo ) =>
{
    message = message || "";
    let err = new Error( message );
    err.message = message;
    if ( errorInfo !== undefined )
    {
        for ( let v in errorInfo )
        {
            err[v] = errorInfo[v];
        }
    }
    err.popStackFrame();
    return err;
}

Error.format = ( message?: string ) =>
{
    let displayMessage = "Sys.InvalidOperationException: " + ( message ? message : Sys.Res.invalidOperation );
    let err = Error.create( displayMessage, { name: 'Sys.InvalidOperationException' } );
    err.popStackFrame();
    return err;
}

Error.invalidOperation = ( message: string | null ) =>
{
    let displayMessage = "Sys.InvalidOperationException: " + ( message ? message : Sys.Res.invalidOperation );
    let err = Error.create( displayMessage, { name: 'Sys.InvalidOperationException' } );
    err.popStackFrame();
    return err;
}

Error.notImplemented = ( message?: string ) =>
{
    let displayMessage = "Sys.NotImplementedException: " + ( message ? message : Sys.Res.notImplemented );
    let err = Error.create( displayMessage, { name: 'Sys.NotImplementedException' } );
    err.popStackFrame();
    return err;
}

Error.prototype.popStackFrame = () =>
{
    if ( typeof( this.stack ) === "undefined" || this.stack === null ||
        typeof( this.fileName ) === "undefined" || this.fileName === null ||
        typeof( this.lineNumber ) === "undefined" || this.lineNumber === null )
    {
        return;
    }
    let stackFrames = this.stack.split("\n");
    let currentFrame = stackFrames[0];
    let pattern = this.fileName + ":" + this.lineNumber;
    while( typeof( currentFrame ) !== "undefined" &&
        currentFrame !== null &&
        currentFrame.indexOf( pattern ) === -1) {
        stackFrames.shift();
        currentFrame = stackFrames[0];
    }
    let nextFrame = stackFrames[1];
    if ( typeof (nextFrame ) === "undefined" || nextFrame === null )
    {
        return;
    }
    let nextFrameParts = nextFrame.match( /@(.*):(\d+)$/ );
    if ( typeof( nextFrameParts ) === "undefined" || nextFrameParts === null )
    {
        return;
    }
    this.fileName = nextFrameParts[1];
    this.lineNumber = parseInt( nextFrameParts[2] );
    stackFrames.shift();
    this.stack = stackFrames.join( "\n" );
}