import { StringBuilder } from "Sys/StringBuilder"

function execute( test: string, callback: ( test: string, result: boolean ) => void )
{
    try
    {
        let sb = new StringBuilder( "Hallo" );
        sb.appendLine( "Hallo" );
        sb.append( "Welt" );
        sb.toString();
        sb.isEmpty();
        sb.clear();
        sb.isEmpty();
        callback( test, true );
    }
    catch ( error )
    {
        callback( test, false );
    }
}

export { execute }