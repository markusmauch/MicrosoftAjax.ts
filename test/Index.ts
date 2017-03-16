import { execute as Date_execute } from "./Date"
import { execute as WebRequest_execute } from "./WebRequest"
import { execute as StringBuilder_execute } from "./StringBuilder"
import { execute as Control_execute } from "./Control"
import { execute as CultureInfo_execute } from "./CultureInfo"
import { execute as Application_execute } from "./Application"

function callback( test: string, result: boolean )
{
    console.log( `${test}:\t\t${result ? "PASS" : "FAIL"}` );
}

Date_execute( "TEST Date", callback );
StringBuilder_execute( "TEST StringBuilder", callback );
Control_execute( "TEST Control", callback );
WebRequest_execute( "TEST WebRequest", callback );
CultureInfo_execute( "TEST CultureInfo", callback );
Application_execute( "TEST Application", callback );
