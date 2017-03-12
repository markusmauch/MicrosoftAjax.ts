
import { CultureInfo } from "Sys/CultureInfo"

function execute( test: string, callback: ( test: string, result: boolean ) => void )
{
    try
    {
        var ci = CultureInfo.InvariantCulture;
        console.log( "Current Culture: " + ci.name );
        callback( test, true );
    }
    catch ( error )
    {
        callback( test, false );
    }
}

export { execute }