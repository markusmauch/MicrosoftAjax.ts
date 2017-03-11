
import { WebRequest } from "Sys/Net/WebRequest"

function execute( test: string, callback: ( test: string, result: boolean ) => void )
{
    let request = new WebRequest();
    request.set_url( "http://localhost:3000/tsconfig.json" );
    request.set_httpVerb( "GET" );
    request.add_completed( ( sender, args ) =>
    {
        if ( sender.get_statusCode() === 200 )
        {
            let t = sender.get_responseData();
            callback( test, true )
        }
        else
        {
            callback( test, false );
        }
        
    } );
    request.invoke();
}

export { execute }
