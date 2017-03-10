
import { Res } from "../Res"
import { EventArgs } from "../EventArgs"
import { WebRequestExecutor } from "./WebRequestExecutor"
import { XMLDOM } from "./XMLDOM"

interface XmlDomDocument extends Document
{
    setProperty( name: string, value: string ): void;
}

class XMLHttpExecutor extends WebRequestExecutor
{
    private _xmlHttpRequest: XMLHttpRequest;
    private _responseAvailable = false;
    private _timedOut = false;
    private _timer: number;
    private _aborted = false;
    private _started = false;

    constructor()
    {
        super();
    }

    public get_started()
    {
        return this._started;
    }

    public get_responseAvailable()
    {
        return this._responseAvailable;
    }

    public get_timedOut()
    {
        return this._timedOut;
    }

    public get_aborted()
    {
        return this._aborted;
    }

    public get_responseData()
    {
        if ( this._responseAvailable == false )
        {
            throw Error.invalidOperation( String.format( Res.cannotCallBeforeResponse, 'get_responseData' ) );
        }
        if ( this._xmlHttpRequest === undefined )
        {
            throw Error.invalidOperation( String.format( Res.cannotCallOutsideHandler, 'get_responseData' ) );
        }
        return this._xmlHttpRequest.responseText;
    }

    public get_statusCode()
    {
        if ( !this._responseAvailable )
        {
            throw Error.invalidOperation( String.format( Res.cannotCallBeforeResponse, 'get_statusCode' ) );
        }
        if ( this._xmlHttpRequest === undefined )
        {
            throw Error.invalidOperation( String.format( Res.cannotCallOutsideHandler, 'get_statusCode' ) );
        }
        var result = 0;
        try
        {
            result = this._xmlHttpRequest.status;
        }
        catch ( ex )
        {}
        return result;
    }

    public get_statusText()
    {
        if ( !this._responseAvailable )
        {
            throw Error.invalidOperation( String.format( Res.cannotCallBeforeResponse, 'get_statusText' ) );
        }
        if ( this._xmlHttpRequest === undefined )
        {
            throw Error.invalidOperation( String.format( Res.cannotCallOutsideHandler, 'get_statusText' ) );
        }
        return this._xmlHttpRequest.statusText;
    }

    public get_xml()
    {
        if ( !this._responseAvailable )
        {
            throw Error.invalidOperation( String.format( Res.cannotCallBeforeResponse, 'get_xml' ) );
        }
        if ( this._xmlHttpRequest === undefined )
        {
            throw Error.invalidOperation( String.format( Res.cannotCallOutsideHandler, 'get_xml' ) );
        }
        var xml = this._xmlHttpRequest.responseXML;
        if ( !xml || !xml.documentElement )
        {
            xml = XMLDOM( this._xmlHttpRequest.responseText );
            if ( !xml || !xml.documentElement )
                return null;
        }
        else if ( navigator.userAgent.indexOf( 'MSIE' ) !== -1 )
        {
            let xmlDomDocument = xml as XmlDomDocument;
            xmlDomDocument.setProperty( 'SelectionLanguage', 'XPath' );
        }
        if ( xml.documentElement.namespaceURI === "http://www.mozilla.org/newlayout/xml/parsererror.xml" &&
            xml.documentElement.tagName === "parsererror" )
        {
            return null;
        }

        if ( xml.documentElement.firstChild && xml.documentElement.firstChild.nodeName === "parsererror" )
        {
            return null;
        }

        return xml;
    }

    private _onReadyStateChange()
    {
        if ( this._xmlHttpRequest.readyState === 4 )
        {
            try
            {
                if ( this._xmlHttpRequest.status === undefined )
                {
                    return;
                }
            }
            catch ( ex )
            {
                return;
            }

            this._clearTimer();
            this._responseAvailable = true;
            this._webRequest.completed( EventArgs.Empty );
            if ( this._xmlHttpRequest !== undefined )
            {
                this._xmlHttpRequest.onreadystatechange = () =>
                {};
                delete this._xmlHttpRequest;
            }
        }
    }

    private _clearTimer()
    {
        if ( this._timer !== undefined )
        {
            window.clearTimeout( this._timer );
            delete this._timer;
        }
    }

    private _onTimeout()
    {
        if ( this._timer !== undefined )
        {
            window.clearTimeout( this._timer );
            delete this._timer;
        }
    }

    public executeRequest()
    {
        if ( this._started )
        {
            throw Error.invalidOperation( String.format( Res.cannotCallOnceStarted, 'executeRequest' ) );
        }
        if ( this._webRequest === null )
        {
            throw Error.invalidOperation( Res.nullWebRequest );
        }
        var body = this._webRequest.get_body();
        var headers = this._webRequest.get_headers();
        this._xmlHttpRequest = new XMLHttpRequest();
        
        //this._xmlHttpRequest.addEventListener( "readyStateChange", this._onReadyStateChange );
        this._xmlHttpRequest.onreadystatechange = () => { this._onReadyStateChange(); };
        var verb = this._webRequest.get_httpVerb();
        this._xmlHttpRequest.open( verb, this._webRequest.getResolvedUrl(), true );
        this._xmlHttpRequest.setRequestHeader( "X-Requested-With", "XMLHttpRequest" );
        if ( headers )
        {
            for ( var header in headers )
            {
                var val = headers[ header ];
                if ( typeof( val ) !== "function" )
                    this._xmlHttpRequest.setRequestHeader( header, val );
            }
        }
        if ( verb.toLowerCase() === "post" )
        {
            if ( ( headers === null ) || !headers[ 'Content-Type' ] )
            {
                this._xmlHttpRequest.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded; charset=utf-8' );
            }
            if ( !body )
            {
                body = "";
            }
        }
        var timeout = this._webRequest.get_timeout();
        if ( timeout > 0 )
        {
            this._timer = window.setTimeout( Function.createDelegate( this, this._onTimeout ), timeout );
        }
        this._xmlHttpRequest.send( body );
        this._started = true;
    }

    public getResponseHeader( header )
    {
        if ( !this._responseAvailable )
        {
            throw Error.invalidOperation( String.format( Res.cannotCallBeforeResponse, 'getResponseHeader' ) );
        }
        if ( !this._xmlHttpRequest )
        {
            throw Error.invalidOperation( String.format( Res.cannotCallOutsideHandler, 'getResponseHeader' ) );
        }
        var result;
        try
        {
            result = this._xmlHttpRequest.getResponseHeader( header );
        }
        catch ( e )
        {}
        if ( !result ) result = "";
        return result;
    }

    public getAllResponseHeaders()
    {
        if ( !this._responseAvailable )
        {
            throw Error.invalidOperation( String.format( Res.cannotCallBeforeResponse, 'getAllResponseHeaders' ) );
        }
        if ( !this._xmlHttpRequest )
        {
            throw Error.invalidOperation( String.format( Res.cannotCallOutsideHandler, 'getAllResponseHeaders' ) );
        }
        return this._xmlHttpRequest.getAllResponseHeaders();
    }

    public abort()
    {
        if ( !this._started )
        {
            throw Error.invalidOperation( Res.cannotAbortBeforeStart );
        }
        if ( this._aborted || this._responseAvailable || this._timedOut )
            return;
        this._aborted = true;
        this._clearTimer();
        if ( this._xmlHttpRequest && !this._responseAvailable )
        {
            this._xmlHttpRequest.onreadystatechange = Function.emptyMethod;
            this._xmlHttpRequest.abort();

            delete this._xmlHttpRequest;
            this._webRequest.completed( EventArgs.Empty );
        }
    }
}

export { XMLHttpExecutor }