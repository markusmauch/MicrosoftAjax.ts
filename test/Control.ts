
import { $create } from "Global"
import { Control, ControlProps } from "Sys/UI/Control"
import { ComponentEvents } from "Sys/Component"
import { EventHandler } from "Sys/EventHandlerList"
import { EventArgs } from "Sys/EventArgs"

interface TestProps extends ControlProps
{
    title: string;
    backgroundColor: string;
}

interface TestEvents extends ComponentEvents
{
    click: EventHandler<MyControl, EventArgs>;
}

class MyControl extends Control
{
    private _title: string;
    private _backgroundColor: string;
    
    public initialize()
    {
        this.get_element().style.backgroundColor = this.get_backgroundColor();
        this.get_element().innerText = this.get_title();
        this._element.addEventListener( "click", () =>
        {
            let h = this.get_events().getHandler( "click" );
            if ( h !== null ) h( this );
        } );
    }

    public get_title()
    {
        return this._title;
    }
    
    public set_title( value: string )
    {
        this._title = value;
    }

    public get_backgroundColor()
    {
        return this._backgroundColor;
    }
    
    public set_backgroundColor( value: string )
    {
        this._backgroundColor = value;
    }

    public add_click( handler: EventHandler<MyControl, EventArgs> )
    {
        this.get_events().addHandler( "click", handler );
    }
}

function execute( test: string, callback: ( test: string, result: boolean ) => void )
{
    try
    {
        let element = document.createElement( "div" );
        document.body.appendChild( element );

        let props: TestProps = { id: "test", title: "CLICK HERE TO PASS TEST", backgroundColor: "red" };
        let events: TestEvents = { click: ( sender, args ) => 
        {
            document.body.removeChild( element );
            callback( test, true );
        } };

        let myControl = $create( MyControl, props, events, null, element );
    }
    catch (error )
    {
        callback( test, false );
    }
}

export { execute }