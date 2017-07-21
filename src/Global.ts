function $create<C extends Sys.Component, P extends Sys.ComponentProps> (
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
    if ( type.inheritsFrom( Sys.UI.Control ) || type.inheritsFrom( Sys.UI.Behavior ) )
    {
        if ( element === null )
        {
            throw Error.argument( "element", Sys.Res.createComponentOnDom );
        }
        component = new type( element );
    }
    else
    {
        component = new Sys.Component();
    }


    component.beginUpdate();

    if ( properties !== null )
    {
        Sys.Component._setProperties( component, properties );
    }

    if ( events !== null )
    {
        for ( let name in events )
        {
            if ( !( component[ "add_" + name ] instanceof Function ) )
            {
                throw Error.invalidOperation( String.format( Sys.Res.undefinedEvent, name ) );
            }
            if ( !( events[ name ] instanceof Function ) )
            {
                throw Error.invalidOperation( Sys.Res.eventHandlerNotFunction );
            }
            component[ "add_" + name ]( events[ name ] );
        }
    }

    // if ( component.get_id() !== undefined )
    // {
    //     Sys.Application.addComponent( component );
    // }

    // let creatingComponents = Sys.Application.get_isCreatingComponents();
    // if ( creatingComponents === true )
    // {
    //     Sys.Application._createdComponents.push( component );
    //     if ( references )
    //     {
    //         Sys.Application._addComponentToSecondPass( component, references );
    //     }
    //     else
    //     {
    //         component.endUpdate();
    //     }
    // }
    // else
    // {
    //     if (references)
    //     {
    //         Sys.Component._setReferences( component, references );
    //     }
    //     component.endUpdate();
    // }

    component.endUpdate();

    return component;
}

function $find( id: string, parent?: any ): Sys.Component
{
    return null; //Sys.Application.findComponent( id, parent );
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
    return Sys.UI.DomElement.getElementById( id, element );
}