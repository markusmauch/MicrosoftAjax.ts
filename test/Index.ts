

class Test extends Sys.Component
{
    public initialize()
    {
        super.initialize();
        alert("TEST");
    }
}


let c = $create( Test, null, null, null, null );
c.initialize();