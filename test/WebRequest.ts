
import { WebRequest } from "../src/Sys/Net/WebRequest"

function execute()
{
    let request = new WebRequest();
    request.set_url( "http://localhost:3000/tsconfig.json" );
    request.set_httpVerb( "GET" );
    request.add_completed( ( sender, args ) =>
    {
        console.log( "OK" );
        let t = sender.get_responseData();
        console.log( t );
        
    } );
    request.invoke();
}

export { execute }
