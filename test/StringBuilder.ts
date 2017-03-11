import { StringBuilder } from "Sys/StringBuilder"

function execute( test: string, callback: ( test: string, result: boolean ) => void )
{
    try {
        let sb = new StringBuilder();
        sb.append( "Hello" );
        sb.appendLine( "World" );
        sb.toString();
        callback( test, true );
    }
    catch ( error )
    {
        callback( test, false );
    }
}

export { execute }