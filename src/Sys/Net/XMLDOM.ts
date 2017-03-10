
declare global
{
    interface Window
    {
        readonly DOMParser: any;
    }
}

function XMLDOM( markup )
{
    if ( !window.DOMParser )
    {
        let progIDs = [ 'Msxml2.DOMDocument.3.0', 'Msxml2.DOMDocument' ];
        for ( let i = 0, l = progIDs.length; i < l; i++ )
        {
            try
            {
                let xmlDOM = new ActiveXObject( progIDs[ i ] );
                xmlDOM.async = false;
                xmlDOM.loadXML( markup );
                xmlDOM.setProperty( 'SelectionLanguage', 'XPath' );
                return xmlDOM;
            }
            catch ( ex )
            {}
        }
    }
    else
    {
        try
        {
            let domParser = new window.DOMParser();
            return domParser.parseFromString( markup, 'text/xml' );
        }
        catch ( ex )
        {}
    }
    return null;
}

export { XMLDOM }