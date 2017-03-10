class WebServiceError
{
    private _timedOut: boolean;
    private _message: string;
    private _stackTrace: string | undefined;
    private _exceptionType: string | undefined;
    private _errorObject: any;
    private _statusCode = -1;
    
    constructor( timedOut: boolean, message: string, stackTrace?: string, exceptionType?: string, errorObject?: any )
    {
        this._timedOut = timedOut;
        this._message = message;
        this._stackTrace = stackTrace;
        this._exceptionType = exceptionType;
        this._errorObject = errorObject;
        this._statusCode = -1;
    }

    public get_timedOut()
    {
        return this._timedOut;
    }

    public get_statusCode()
    {
        return this._statusCode;
    }

    public get_message()
    {
        return this._message;
    }

    public get_stackTrace()
    {
        return this._stackTrace || "";
    }

    public get_exceptionType()
    {
        return this._exceptionType || "";
    }

    public get_errorObject()
    {
        return this._errorObject || null;
    }
}

export { WebServiceError }