module Sys
{
    export enum Browser
    {
        "InternetExplorer",
        "FireFox",
        "Safari",
        "Opera",
        // TODO Chrome
    }

    export namespace Browser
    {
        export let agent: Browser;
        export let hasDebuggerStatement = false;
		export let name = navigator.appName;
		export let version = parseFloat( navigator.appVersion );
		export let documentMode = 0;

        function _init()
        {
            if ( navigator.userAgent.indexOf( ' MSIE ' ) > -1 )
			{
				agent = Sys.Browser.InternetExplorer;
                let match = navigator.userAgent.match( /MSIE (\d+\.\d+)/ );
                if ( match !== null )
                {
                    Sys.Browser.version = parseFloat( match[1] );
                    if ( Sys.Browser.version >= 8 )
                    {
                        let documentMode = document[ "documentMode" ];
                        if ( documentMode !== undefined && documentMode >= 7 )
                        {
                            Sys.Browser.documentMode = documentMode;
                        }
                    }
                }
                Sys.Browser.hasDebuggerStatement = true;
			}
			else if ( navigator.userAgent.indexOf( ' Firefox/' ) > -1 )
			{
				Sys.Browser.agent = Sys.Browser.FireFox;
				let match = navigator.userAgent.match( / Firefox\/(\d+\.\d+)/ );
                if ( match !== null )
                {
                    Sys.Browser.version = parseFloat( match[ 1 ] );
				    Sys.Browser.name = "Firefox";
                }
				Sys.Browser.hasDebuggerStatement = true;
			}
			else if ( navigator.userAgent.indexOf( ' AppleWebKit/' ) > -1 )
			{
                Sys.Browser.agent = Sys.Browser.Safari;
				let match = navigator.userAgent.match( / AppleWebKit\/(\d+(\.\d+)?)/ );
                if ( match !== null )
                {
                    Sys.Browser.version = parseFloat( match[ 1 ] );
                    Sys.Browser.name = 'Safari';
                }
			}
			else if ( navigator.userAgent.indexOf( 'Opera/' ) > -1 )
			{
				Sys.Browser.agent = Sys.Browser.Opera;
			}
        }

        _init();
    }
}
