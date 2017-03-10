
import { Res } from "./Sys/Res"
import { Component, ComponentProps } from "./Sys/Component"
import { Control } from "./Sys/UI/Control"
import { Behavior } from "./Sys/UI/Behavior"
import { DomElement } from "./Sys/UI/DomElement"

function $create<C extends Component | Control | Behavior, P extends ComponentProps> (
    type:
    {
        new( element ? : HTMLElement ): C;
    },
    properties: P | null,
    events:
    {
        [ name: string ]: any
    } | null,
    references: any | null,
    element: HTMLElement | null )
{
    let component;
    if ( type.inheritsFrom( Control ) || type.inheritsFrom( Behavior ) )
    {
        if ( element === null )
        {
            throw Error.argument( "element", Res.createComponentOnDom );
        }
        component = new type( element );
    }
    else
    {
        component = new Component();
    }

    //var app = Application;
    //var creatingComponents = app.get_isCreatingComponents();

    component.beginUpdate();

    if ( properties !== null )
    {
        Component._setProperties( component, properties );
    }

    if ( events !== null )
    {
        for ( let name in events )
        {
            if ( !( component[ "add_" + name ] instanceof Function ) )
            {
                throw Error.invalidOperation( String.format( Res.undefinedEvent, name ) );
            }
            if ( !( events[ name ] instanceof Function ) )
            {
                throw Error.invalidOperation( Res.eventHandlerNotFunction );
            }
            component[ "add_" + name ]( events[ name ] );
        }
    }

    // if ( component.get_id() )
    // {
    //     app.addComponent(component);
    // }
    // if ( creatingComponents )
    // {
    //     app._createdComponents[app._createdComponents.length] = component;
    //     if (references) {
    //         app._addComponentToSecondPass(component, references);
    //     }
    //     else {
    //         component.endUpdate();
    //     }
    // }
    // else {
    //     if (references) {
    //         Sys$Component$_setReferences(component, references);
    //     }
    //     component.endUpdate();
    // }

    component.endUpdate();

    return component;
}

/**
 * Provides a shortcut to the {@link getElementById} method of the {@link Sys.UI.DomElement} class.
 * This member is static and can be invoked without creating an instance of the class.
 * @param id
 *      The ID of the DOM element to find.
 * @param element
 *      The parent element to search. The default is the document element.
 */
function $get( id: string, element?: HTMLElement )
{
    return DomElement.getElementById( id, element );
}

