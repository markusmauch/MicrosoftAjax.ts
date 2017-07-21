namespace Sys.Net
{
    export type HttpVerb = "GET" | "POST";

    export type HttpHeaders = {
        [ name: string ]: string
    };

    export class WebRequest
    {

        private _url = "";
        private _headers: HttpHeaders = {};
        private _body: string;
        private _userContext: any;
        private _httpVerb: HttpVerb;
        private _executor: Sys.Net.WebRequestExecutor;
        private _invokeCalled = false;
        private _timeout = 0;

        private _events = new Sys.EventHandlerList();

        /**
         * Registers a handler for the completed request event of the Web request.
         * @param handler
         * 		The function registered to handle the completed request event.
         */
        public add_completed( handler: Sys.EventHandler < Sys.Net.WebRequestExecutor, Sys.EventArgs > )
        {
            this._get_eventHandlerList().addHandler( "completed", handler );
        }

        /**
         * Removes the event handler associated with the Web request instance.
         * @param handler
         * 		The function registered to handle the completed request event.
         */
        public remove_completed( handler: Sys.EventHandler < Sys.Net.WebRequestExecutor, Sys.EventArgs > )
        {
            this._get_eventHandlerList().removeHandler( "completed", handler );
        }

        /**
         * Raises the completed event for the associated WebRequest instance.
         * @param eventArgs
         * 		The value to pass to the Web request completed event handler.
         */
        public completed( eventArgs: Sys.EventArgs )
        {
            let handler = Sys.Net.WebRequestManager._get_eventHandlerList().getHandler( "completedRequest" );
            if ( handler )
            {
                handler( this._executor, eventArgs );
            }
            handler = this._get_eventHandlerList().getHandler( "completed" );
            if ( handler )
            {
                handler( this._executor, eventArgs );
            }
        }

        public _get_eventHandlerList()
        {
            if ( !this._events )
            {
                this._events = new Sys.EventHandlerList();
            }
            return this._events;
        }

        /**
         * Gets the URL of the {@link WebRequest} instance.
         * @returns
         * 		A string that represents the URL that the Web request is directed to.
         */
        public get_url()
        {
            return this._url;
        }

        /**
         * Sets the URL of the {@link WebRequest} instance.
         * @param value
         * 		A string that represents the URL that the Web request is directed to.
         */
        public set_url( value: string )
        {
            this._url = value;
        }

        /**
         * Gets the HTTP headers for the WebRequest instance.
         * @returns
         * 		A dictionary of name/value pairs that contains the HTTP headers that are sent with the Web request.
         */
        public get_headers(): HttpHeaders
        {
            return this._headers;
        }

        /**
         * Gets or sets the HTTP verb that was used by the {@link WebRequest} class to issue the Web request.
         * @returns
         * 		A string that contains the HTTP verb for the Web request. value must be an HTTP verb that is recognized by the Web server, such as "GET" or "POST".
         */
        public get_httpVerb()
        {
            if ( this._httpVerb === undefined )
            {
                if ( this._body === undefined )
                {
                    return "GET";
                }
                return "POST";
            }
            return this._httpVerb;
        }

        /**
         * Sets the HTTP verb that was used by the {@link WebRequest} class to issue the Web request.
         * @param value
         * 		A string that contains the HTTP verb for the Web request. value must be an HTTP verb that is recognized by the Web server, such as "GET" or "POST".
         */
        public set_httpVerb( value: HttpVerb )
        {
            this._httpVerb = value;
        }

        /**
         * Gets the HTTP body of the WebRequest instance.
         * @returns
         * 		The HTTP body to assign to the Web request.
         */
        public get_body()
        {
            return this._body;
        }

        /**
         * Sets the HTTP body of the WebRequest instance.
         * @param value
         * 		The HTTP body to assign to the Web request.
         */
        public set_body( value: string )
        {
            this._body = value;
        }

        /**
         * Gets the user context associated with the WebRequest instance.
         * @returns
         * 		The user context information that is associated with the request. value can be null or any primitive type or JavaScript object.
         */
        public get_userContext()
        {
            return this._userContext;
        }

        /**
         * Sets the user context associated with the WebRequest instance.
         * @param value
         * 		The user context information that is associated with the request. value can be null or any primitive type or JavaScript object.
         */
        public set_userContext( value: any )
        {
            this._userContext = value;
        }

        /**
         * Gets the executor of the associated WebRequest instance.
         * @returns
         * 		An instance of a class that is derived from {@link WebRequestExecutor}.
         */
        public get_executor()
        {
            return this._executor;
        }

        /**
         * Sets the executor of the associated WebRequest instance.
         * @param value
         * 		An instance of a class that is derived from {@link WebRequestExecutor}.
         */
        public set_executor( value: Sys.Net.WebRequestExecutor )
        {
            if ( this._executor !== undefined && this._executor.get_started() )
            {
                throw Error.invalidOperation( Sys.Res.setExecutorAfterActive );
            }
            this._executor = value;
            this._executor._set_webRequest( this );
        }

        /**
         * Gets or sets the time-out value for the WebRequest instance.
         * @returns
         * 		The time interval in milliseconds.
         */
        public get_timeout()
        {
            if ( this._timeout === 0 )
            {
                return Sys.Net.WebRequestManager.get_defaultTimeout();
            }
            return this._timeout;
        }

        /**
         * Sets the time-out value for the WebRequest instance.
         * @param value
         * 		The time interval in milliseconds.
         */
        public set_timeout( value: number )
        {
            if ( value < 0 )
            {
                throw Error.argumentOutOfRange( "value", value, Sys.Res.invalidTimeout );
            }
            this._timeout = value;
        }

        /**
         * Gets the resolved URL of the {@link WebRequest} instance.
         * @returns
         * 		A string that represents the URL that the Web request is directed to.
         */
        public getResolvedUrl()
        {
            return this._resolveUrl( this._url );
        }

        /**
         * Executes a Web request.
         */
        public invoke()
        {
            if ( this._invokeCalled )
            {
                throw Error.invalidOperation( Sys.Res.invokeCalledTwice );
            }
            Sys.Net.WebRequestManager.executeRequest( this );
            this._invokeCalled = true;
        }

        private _resolveUrl( url: string, baseUrl ? : string )
        {
            if ( url && url.indexOf( '://' ) !== -1 )
            {
                return url;
            }
            if ( !baseUrl || baseUrl.length === 0 )
            {
                var baseElement = document.getElementsByTagName( 'base' )[ 0 ];
                if ( baseElement && baseElement.href && baseElement.href.length > 0 )
                {
                    baseUrl = baseElement.href;
                }
                else
                {
                    baseUrl = document.URL;
                }
            }
            var qsStart = baseUrl.indexOf( '?' );
            if ( qsStart !== -1 )
            {
                baseUrl = baseUrl.substr( 0, qsStart );
            }
            qsStart = baseUrl.indexOf( '#' );
            if ( qsStart !== -1 )
            {
                baseUrl = baseUrl.substr( 0, qsStart );
            }
            baseUrl = baseUrl.substr( 0, baseUrl.lastIndexOf( '/' ) + 1 );
            if ( !url || url.length === 0 )
            {
                return baseUrl;
            }
            if ( url.charAt( 0 ) === '/' )
            {
                var slashslash = baseUrl.indexOf( '://' );
                if ( slashslash === -1 )
                {
                    throw Error.argument( "baseUrl", Sys.Res.badBaseUrl1 );
                }
                var nextSlash = baseUrl.indexOf( '/', slashslash + 3 );
                if ( nextSlash === -1 )
                {
                    throw Error.argument( "baseUrl", Sys.Res.badBaseUrl2 );
                }
                return baseUrl.substr( 0, nextSlash ) + url;
            }
            else
            {
                var lastSlash = baseUrl.lastIndexOf( '/' );
                if ( lastSlash === -1 )
                {
                    throw Error.argument( "baseUrl", Sys.Res.badBaseUrl3 );
                }
                return baseUrl.substr( 0, lastSlash + 1 ) + url;
            }
        }

        /**
         * @param queryString
         *      (Optional) An object containing key value pairs to be serialized as query string.
         * @param encodeMethod
         *      (Optional) The method to be used for the encoding. If not specified, the browser's encodeURIComponent method is used.
         * @param addParams
         *      (Optiona) Additional parameters; already encoded as url string.
         */
        public static _createQueryString( queryString: { [arg: string]: any } | null, encodeMethod: Function | null, addParams?: string )
        {
            queryString = queryString || {};
            encodeMethod = encodeMethod || encodeURIComponent;

            let i = 0;
            let sb = new Sys.StringBuilder();

            for ( let arg in queryString )
            {
                let obj = queryString[ arg ];
                if ( typeof( obj ) === "function" ) continue;

                let val = Sys.Serialization.JavaScriptSerializer.serialize( obj );
                if ( i++ )
                {
                    sb.append( '&' );
                }
                sb.append( arg );
                sb.append( '=' );
                sb.append( encodeMethod( val ) );
            }
            if ( addParams !== undefined )
            {
                if ( i )
                {
                    sb.append( '&' );
                }
                sb.append( addParams );
            }
            return sb.toString();
        }

        public static _createUrl( url: string, queryString, addParams )
        {
            if ( !queryString && !addParams )
            {
                return url;
            }
            var qs = WebRequest._createQueryString( queryString, null, addParams );
            return qs.length ?
                url + ( ( url && url.indexOf( '?' ) >= 0 ) ? "&" : "?" ) + qs :
                url;
        }
    }
}