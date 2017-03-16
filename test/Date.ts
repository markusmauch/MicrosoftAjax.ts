import "Date"
import { CultureInfo } from "Sys/CultureInfo"

function execute( test: string, callback: ( test: string, result: boolean ) => void )
{
    try
    {
        let date = Date.parseLocal( "03.04.2017", "dd.MM.yyyy" );
        if ( date !== null )
        {
            console.log( date.format( "yyyy-MM-dd" ) );
            callback( test, true );
        }
        else
        {
            callback( test, false );    
        }
    }
    catch ( error )
    {
        callback( test, false );
    }
}

export { execute }