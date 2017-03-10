enum Browser
{
    "InternetExplorer",
    "FireFox",
    "Safari",
    "Opera",
    // TODO Chrome
}

namespace Browser
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
            agent = Browser.InternetExplorer;
            let match = navigator.userAgent.match( /MSIE (\d+\.\d+)/ );
            if ( match !== null )
            {
                Browser.version = parseFloat( match[1] );
                if ( Browser.version >= 8 )
                {
                    let documentMode = document[ "documentMode" ];
                    if ( documentMode !== undefined && documentMode >= 7 )
                    {
                        Browser.documentMode = documentMode;
                    }
                }
            }
            Browser.hasDebuggerStatement = true;
        }
        else if ( navigator.userAgent.indexOf( ' Firefox/' ) > -1 )
        {
            Browser.agent = Browser.FireFox;
            let match = navigator.userAgent.match( / Firefox\/(\d+\.\d+)/ );
            if ( match !== null )
            {
                Browser.version = parseFloat( match[ 1 ] );
                Browser.name = "Firefox";
            }
            Browser.hasDebuggerStatement = true;
        }
        else if ( navigator.userAgent.indexOf( ' AppleWebKit/' ) > -1 )
        {
            Browser.agent = Browser.Safari;
            let match = navigator.userAgent.match( / AppleWebKit\/(\d+(\.\d+)?)/ );
            if ( match !== null )
            {
                Browser.version = parseFloat( match[ 1 ] );
                Browser.name = 'Safari';
            }
        }
        else if ( navigator.userAgent.indexOf( 'Opera/' ) > -1 )
        {
            Browser.agent = Browser.Opera;
        }
    }

    _init();
}

export { Browser }
