
import { Res } from "../Res"
import { JavaScriptSerializer } from "../Serialization/JavaScriptSerializer"
import { WebServiceError } from "./WebServiceError"
import { WebRequest } from "./WebRequest"

let _jsonp = 0;

type WebSerciceCallback = ( result: any, userContext: any, methodName: string ) => void;

interface WebServiceDataObject
{
    [propertyName: string]: any;
};

interface TypedWebServiceDataObject extends WebServiceDataObject
{
    __type: string;
}

/**
 * Provides a way to call a method of a specified Web service asynchronously.
 */
class WebServiceProxy
{
    static _xdomain = /^\s*([a-zA-Z0-9\+\-\.]+\:)\/\/([^?#\/]+)/;

    protected _timeout: number;
    protected _userContext: any;
    protected _succeeded: WebSerciceCallback = ( result: any, userContext: any, methodName: string ) => {};
    protected _failed: WebSerciceCallback = ( result: any, userContext: any, methodName: string ) => {};
    protected _path: string;
    protected _enableJsonp = false;
    protected _jsonp: string;
    protected _callbackParameter = "Callback";

    /**
     * Gets the timeout, in milliseconds, for the service.
     * @returns
     *      The timeout, in milliseconds, for the service.
     */
    public get_timeout()
    {
        return this._timeout || 0;
    }

    /**
     * Sets the timeout, in milliseconds, for the service.
     * @param value
     *      The timeout, in milliseconds, for the service.
     */
    public set_timeout( value: number )
    {
        if ( value < 0 )
        {
            throw Error.argumentOutOfRange( 'value', value, Res.invalidTimeout );
        }
        this._timeout = value;
    }

    /**
     * Gets the default user context for the service.
     * @returns
     *      A reference to the user context for the service.
     */
    public get_defaultUserContext()
    {
        return this._userContext;
    }

    /**
     * Sets the default user context for the service.
     * @param value
     *      A reference to the user context for the service.
     */
    public set_defaultUserContext( value )
    {
        this._userContext = value;
    }

    /**
     * Gets the default succeeded callback function for the service.
     * @returns
     *      A reference to the succeeded callback function for the service.
     */
    public get_defaultSucceededCallback()
    {
        return this._succeeded || null;
    }

    /**
     * Sets the default succeeded callback function for the service.
     * @param value
     *      A reference to the succeeded callback function for the service.
     */
    public set_defaultSucceededCallback( value )
    {
        this._succeeded = value;
    }

    /**
     * Gets the default failed callback function for the service.
     * @returns
     *      A reference to the failed callback function for the service.
     */
    public get_defaultFailedCallback()
    {
        return this._failed || null;
    }

    /**
     * Sets the default failed callback function for the service.
     * @param value
     *      A reference to the failed callback function for the service.
     */
    public set_defaultFailedCallback( value )
    {
        this._failed = value;
    }

    /**
     * Gets a value that indicates whether the service supports JSONP for cross-domain calls.
     * @returns
     *      true if the Web service supports JSONP for cross-domain calls; otherwise, false.
     */
    public get_enableJsonp()
    {
        return this._enableJsonp;
    }
    
    /**
     * Sets a value that indicates whether the service supports JSONP for cross-domain calls.
     * @param value
     *      true if the Web service supports JSONP for cross-domain calls; otherwise, false.
     */
    public set_enableJsonp( value: boolean )
    {
        this._enableJsonp = value;
    }

    /**
     * Gets the path of the service.
     * @returns
     *      The full path of the service.
     */
    public get_path()
    {
        return this._path || null;
    }

    /**
     * Sets the path of the service.
     * @param
     *      The full path of the service.
     */
    public set_path( value: string )
    {
        this._path = value;
    }

    /**
     * Gets a value that specifies the callback function name for a JSONP request.
     * @returns
     *      A string that contains the name of the callback function for a JSONP request.
     */
    public get_jsonpCallbackParameter()
    {
        return this._callbackParameter;
    }

    /**
     * Sets a value that specifies the callback function name for a JSONP request.
     * @param value
     *      A string that contains the name of the callback function for a JSONP request.
     */
    public set_jsonpCallbackParameter( value:string )
    {
        this._callbackParameter = value;
    }

    /**
     * Called by the service-generated proxy classes.
     * 
     * @param servicePath
     *      A string that contains the Web service URL. ServicePath can be set to a fully qualified URL (http://www.mySite.com/myService.asmx),
     *      to an absolute URL without the host name or the fully qualified domain name (FQDN) (/myService.asmx), or to a relative URL (../myService.asmx).
     *      The WebRequest class makes sure that the URL is converted into a form that is usable by network executors.
     * @param methodName
     *      A string that contains the name of the Web service method to invoke.
     * @param useGet
     *      (Optional) false to set the Web request HTTP verb to POST; otherwise, true. The default is false.
     * @param params
     *      (Optional) A JavaScript dictionary that contains named properties (fields) that correspond to the parameters of the method to call.
     * @param onSuccess
     *      (Optional) The function that is invoked as a callback if the Web service method call returns successfully.
     *      onSuccess can be set to null if you do not need it and if you must specify a value for the remaining parameters.
     *      If no callback function is provided, no action is taken when the Web service method finishes successfully.
     * @param onFailure
     *      (Optional) The function that is invoked as a callback if the Web service method call fails.
     *      onFailure can be set to null if you do not need it and if you must specify a value for the remaining parameters.
     *      If no callback function is provided, no action is taken if an error occurs during the Web service method call.
     * @param userContext
     *      (Optional) Any user-specific information. userContext can be any JavaScript primitive type, array, or object.
     *      The contents of userContext are passed to the callback functions (if any). If userContext is not provided, null is passed to the callback function.
     */
    protected _invoke(
        servicePath: string,
        methodName: string,
        useGet: boolean,
        params: any,
        onSuccess?: WebSerciceCallback,
        onFailure?: WebSerciceCallback,
        userContext?: any )
    {
        onSuccess = onSuccess || this.get_defaultSucceededCallback();
        onFailure = onFailure || this.get_defaultFailedCallback();
        if ( userContext === null || undefined )
        {
            userContext = this.get_defaultUserContext();
        }
        return WebServiceProxy.invoke(
            servicePath,
            methodName,
            useGet,
            params,
            onSuccess,
            onFailure,
            userContext,
            this.get_timeout(),
            this.get_enableJsonp(),
            this.get_jsonpCallbackParameter() );
    }

    /**
     * Invokes the specified Web service method.
     * @param servicePath
     *      A string that contains the Web service URL. ServicePath can be set to a fully qualified URL (http://www.mySite.com/myService.asmx),
     *      to an absolute URL without the host name or the fully qualified domain name (FQDN) (/myService.asmx), or to a relative URL (../myService.asmx).
     *      The WebRequest class makes sure that the URL is converted into a form that is usable by network executors.
     * @param methodName
     *      A string that contains the name of the Web service method to invoke.
     * @param useGet
     *      (Optional) false to set the Web request HTTP verb to POST; otherwise, true. The default is false.
     * @param params
     *      (Optional) A JavaScript dictionary that contains named properties (fields) that correspond to the parameters of the method to call.
     * @param onSuccess
     *      (Optional) The function that is invoked as a callback if the Web service method call returns successfully.
     *      onSuccess can be set to null if you do not need it and if you must specify a value for the remaining parameters.
     *      If no callback function is provided, no action is taken when the Web service method finishes successfully.
     * @param onFailure
     *      (Optional) The function that is invoked as a callback if the Web service method call fails.
     *      onFailure can be set to null if you do not need it and if you must specify a value for the remaining parameters.
     *      If no callback function is provided, no action is taken if an error occurs during the Web service method call.
     * @param userContext
     *      (Optional) Any user-specific information. userContext can be any JavaScript primitive type, array, or object.
     *      The contents of userContext are passed to the callback functions (if any). If userContext is not provided, null is passed to the callback function.
     * @param timeout
     *      (Optional) The time in milliseconds that the network executor must wait before timing out the Web request.
     *      timeout can be an integer or null. By defining a time-out interval, you can control the time that the application must wait for the callback to finish.
     * @param enableJsonp
     *      (Optional) true to indicate that the service supports JSONP for cross-domain calls; otherwise, false.
     * @param jsonpCallbackParameter
     *      (Optional) The name of the callback parameter for the JSONP request. The default is "callback".
     * @returns
     *      The {@link WebRequest} instance that is used to call the method. This instance can be used to stop the call.
     */
    public static invoke(
        servicePath: string,
        methodName: string,
        useGet = true,
        params?: { [name:string]: any },
        onSuccess?: WebSerciceCallback | null,
        onFailure?: WebSerciceCallback | null,
        userContext?: any,
        timeout?: number | null,
        enableJsonp?: boolean,
        jsonpCallbackParameter?: string )
    {
        let schemeHost = ( enableJsonp !== false ) ? WebServiceProxy._xdomain.exec( servicePath ) : null;
        let tempCallback;
        let jsonp = schemeHost && ( schemeHost.length === 3 ) && ( ( schemeHost[ 1 ] !== location.protocol ) || ( schemeHost[ 2 ] !== location.host ) );
        useGet = jsonp || useGet;
        if ( jsonp )
        {
            jsonpCallbackParameter = jsonpCallbackParameter || "callback";
            tempCallback = "_jsonp" + _jsonp++;
        }
        if ( !params ) params = {};
        var urlParams = params;
        if ( !useGet || !urlParams ) urlParams = {};
        let timeoutcookie: number | undefined;

        let script: HTMLScriptElement;
        let error: WebServiceError;
        let loader;
        let url = WebRequest._createUrl( methodName ?
                ( servicePath + "/" + encodeURIComponent( methodName ) ) :
                servicePath, urlParams, jsonp ? ( jsonpCallbackParameter + "=" + tempCallback ) : null );
        
        if ( jsonp || false ) // TODO
        {
            script = document.createElement( "script" );
            script.src = url;
            /*
            loader = new _ScriptLoaderTask( script, function( script, loaded )
            {
                if ( !loaded || tempCallback )
                {
                    jsonpComplete(
                    {
                        Message: String.format( Res.webServiceFailedNoMsg, methodName )
                    }, -1 );
                }
            } );
            */ //TODO
            let jsonpComplete = function( data, statusCode )
            {
                if ( timeoutcookie !== undefined )
                {
                    window.clearTimeout( timeoutcookie );
                    timeoutcookie = undefined;
                }
                loader.dispose();
                window[ "Sys" ].tempCallback;
                tempCallback = null;
                if ( ( typeof( statusCode ) !== "undefined" ) && ( statusCode !== 200 ) )
                {
                    if ( onFailure )
                    {
                        error = new WebServiceError( false,
                            data.Message || String.format( Res.webServiceFailedNoMsg, methodName ),
                            data.StackTrace || null,
                            data.ExceptionType || null,
                            data );
                        error[ "_statusCode" ] = statusCode; // TODO
                        onFailure( error, userContext, methodName );
                    }
                    else
                    {
                        let errorMsg: string;
                        if ( data.StackTrace && data.Message )
                        {
                            errorMsg = data.StackTrace + "-- " + data.Message;
                        }
                        else
                        {
                            errorMsg = data.StackTrace || data.Message;
                        }
                        errorMsg = String.format( errorMsg ? Res.webServiceFailed : Res.webServiceFailedNoMsg, methodName, errorMsg );
                        throw WebServiceProxy._createFailedError( methodName, String.format( Res.webServiceFailed, methodName, errorMsg ) );
                    }
                }
                else if ( onSuccess )
                {
                    onSuccess( data, userContext, methodName );
                }
            }

            window[ "Sys" ].tempCallback = jsonpComplete;
            loader.execute();
            return null;
        }
        var request = new WebRequest();
        request.set_url( url );
        request.get_headers()[ 'Content-Type' ] = 'application/json; charset=utf-8';

        if ( useGet === true )
        {
            request.set_httpVerb( "GET" );
        }
        else
        {
            request.set_httpVerb( "POST" );
            let body = JavaScriptSerializer.serialize( params );
            if ( body === "{}" ) body = "";
            request.set_body( body );
        }
        request.add_completed( onComplete );
        if ( timeout && timeout > 0 ) request.set_timeout( timeout );
        request.invoke();

        function onComplete( response, eventArgs )
        {
            if ( response.get_responseAvailable() )
            {
                var statusCode = response.get_statusCode();
                let result;

                try
                {
                    var contentType = response.getResponseHeader( "Content-Type" );
                    if ( contentType.startsWith( "application/json" ) )
                    {
                        result = response.get_object();
                    }
                    else if ( contentType.startsWith( "text/xml" ) )
                    {
                        result = response.get_xml();
                    }
                    else
                    {
                        result = response.get_responseData();
                    }
                }
                catch ( ex )
                {}
                var error = response.getResponseHeader( "jsonerror" );
                var errorObj = ( error === "true" );
                if ( errorObj )
                {
                    if ( result !== undefined )
                    {
                        let err = result as any;
                        result = new WebServiceError( false, err.Message, err.StackTrace, err.ExceptionType, result );
                    }
                }
                else if ( contentType.startsWith( "application/json" ) )
                {
                    result = ( !result || ( result.d === undefined ) ) ? result : result.d;
                }
                if ( ( ( statusCode < 200 ) || ( statusCode >= 300 ) ) || errorObj )
                {
                    if ( onFailure )
                    {
                        if ( !result || !errorObj )
                        {
                            result = new WebServiceError( false, String.format( Res.webServiceFailedNoMsg, methodName ) );
                        }
                        result._statusCode = statusCode;
                        onFailure( result, userContext, methodName );
                    }
                    else
                    {
                        if ( result && errorObj )
                        {
                            error = result.get_exceptionType() + "-- " + result.get_message();
                        }
                        else
                        {
                            error = response.get_responseData();
                        }
                        throw WebServiceProxy._createFailedError( methodName, String.format( Res.webServiceFailed, methodName, error ) );
                    }
                }
                else if ( onSuccess )
                {
                    onSuccess( result, userContext, methodName );
                }
            }
            else
            {
                var msg;
                if ( response.get_timedOut() )
                {
                    msg = String.format( Res.webServiceTimedOut, methodName );
                }
                else
                {
                    msg = String.format( Res.webServiceFailedNoMsg, methodName )
                }
                if ( onFailure )
                {
                    onFailure( new WebServiceError( response.get_timedOut(), msg, "", "" ), userContext, methodName );
                }
                else
                {
                    throw WebServiceProxy._createFailedError( methodName, msg );
                }
            }
        }
        return request;
    }

    public static _createFailedError( methodName, errorMessage )
    {
        var displayMessage = "WebServiceFailedException: " + errorMessage;
        var e = Error.create( displayMessage,
        {
            'name': 'WebServiceFailedException',
            'methodName': methodName
        } );
        e.popStackFrame();
        return e;
    }

    public static _defaultFailedCallback( err, methodName )
    {
        var error = err.get_exceptionType() + "-- " + err.get_message();
        throw WebServiceProxy._createFailedError( methodName, String.format( Res.webServiceFailed, methodName, error ) );
    }

    public static _generateTypedConstructor( type ): ( properties?: WebServiceDataObject ) => TypedWebServiceDataObject
    {
        return function( properties?: WebServiceDataObject )
        {
            let result: TypedWebServiceDataObject = { __type: type };
            if ( properties !== undefined )
            {
                for ( var name in properties )
                {
                    result[ name ] = properties[ name ];
                }
            }
            return result;
        }
    }
}

export { WebSerciceCallback, WebServiceDataObject, TypedWebServiceDataObject, WebServiceProxy }