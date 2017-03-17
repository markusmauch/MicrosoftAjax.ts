
import { Res } from "Sys/Res"
import { Component, ComponentProps } from "Sys/Component"
import { Control } from "Sys/UI/Control"
import { Behavior } from "Sys/UI/Behavior"
import { DomElement } from "Sys/UI/DomElement"
import { Application, IContainer } from "Sys/Application"
import { CultureInfo } from "Sys/CultureInfo"

function $create<C extends Component, P extends ComponentProps> (
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
    element: HTMLElement | null ) : C
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

    if ( component.get_id() !== undefined )
    {
        Application.addComponent( component );
    }
    
    let creatingComponents = Application.get_isCreatingComponents();
    if ( creatingComponents === true )
    {
        Application._createdComponents.push( component );
        if ( references )
        {
            Application._addComponentToSecondPass( component, references );
        }
        else
        {
            component.endUpdate();
        }
    }
    else
    {
        if (references)
        {
            Component._setReferences( component, references );
        }
        component.endUpdate();
    }

    component.endUpdate();

    return component;
}

function $find( id: string, parent?: IContainer ): Component
{
    return Application.findComponent( id, parent );
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

export { $create, $find, $get }