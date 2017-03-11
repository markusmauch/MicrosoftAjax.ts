import { execute as WebRequest_execute } from "./WebRequest"
import { execute as StringBuilder_execute } from "./StringBuilder"

function callback( test: string, result: boolean )
{
    console.log( `${test}:\t\t${result ? "PASS" : "FAIL"}` );
}

WebRequest_execute( "TEST StringBuilder", callback );
WebRequest_execute( "TEST WebRequest", callback );