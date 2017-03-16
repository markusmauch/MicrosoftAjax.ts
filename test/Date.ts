import "Date"
import { CultureInfo } from "Sys/CultureInfo"

function execute( test: string, callback: ( test: string, result: boolean ) => void )
{
    try
    {
        let d = Date._parse( "13.03.2017", CultureInfo.CurrentCulture, [] );
        if ( !d ) callback( test, false );
        
    }
    catch ( error )
    {
        callback( test, false );
    }
}

export { execute }