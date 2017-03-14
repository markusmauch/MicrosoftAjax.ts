
import { Application } from "Sys/Application"

function execute( test: string, callback: ( test: string, result: boolean ) => void )
{
    try
    {
        Application.add_load( ( sender, args ) =>
        {
            callback( test, true );
        } );
    }
    catch ( error )
    {
        callback( test, false );
    }
}

export { execute }