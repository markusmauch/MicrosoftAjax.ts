
import { Bounds } from "./Bounds"
import { Point } from "./Point"
import { VisibilityMode } from "./VisibilityMode"

class DomElement
{
    /**
     * Adds a CSS class to a DOM element if the class is not already part of the DOM element.
     * This member is static and can be invoked without creating an instance of the class.
     * @param element
     *      The {HTMLElement} object to add the CSS class to.
     * @param className
     *      The name of the CSS class to add.
     */
    public static addCssClass( element: HTMLElement, className: string )
    {
        if ( !DomElement.containsCssClass( element, className ) )
        {
            if ( element.className === "" )
            {
                element.className = className;
            }
            else
            {
                element.className += ' ' + className;
            }
        }
    }

    /**
     * Gets a value that indicates whether the DOM element contains the specified CSS class.
     * This member is static and can be invoked without creating an instance of the class.
     * @param element
     *      The {@link HTMLElement} object to test for the CSS class.
     * @param className
     *      The name of the CSS class to test for.
     * @returns
     *      true if the element contains the specified CSS class; otherwise, false.
     */
    public static containsCssClass( element: HTMLElement, className: string )
    {
        return Array.contains( element.className.split( " " ), className );
    }

    /**
     * Gets a set of integer coordinates that represent the position, width, and height of a DOM element.
     * This member is static and can be invoked without creating an instance of the class.
     * @param element
     *      The Sys.UI.DomElement instance to get the coordinates of.
     * @returns
     *      An object of the JavaScript type Object that contains the x-coordinate and y-coordinate of the upper-left corner, the width, and the height of the element in pixels.
     */
    public static getBounds( element: HTMLElement )
    {
        let rect = element.getBoundingClientRect();
        return new Bounds( rect.left, rect.top, rect.width, rect.height );
    }

    /**
     * Gets a DOM element that has the specified id attribute.
     * This member is static and can be invoked without creating an instance of the class.
     * @param id
     *      The ID of the element to find.
     * @param element
     *      The parent element to search in. The default is the document element.
     * @returns
     *      The {@link HTMLElement} object with the specified ID.
     */
    public static getElementById( id: string, element ? : HTMLElement )
    {
        return ( element || document ).querySelector( "#" + id ) as HTMLElement;
    }

    /**
     * Gets the absolute position of a DOM element relative to the upper-left corner of the owner frame or window.
     * This member is static and can be invoked without creating an instance of the class.
     * @param element
     *      The target element.
     * @returns
     *      An object of the JavaScript type Object that contains the x-coordinate and y-coordinate of the element in pixels.
     */
    public static getLocation( element: HTMLElement )
    {
        let rect = element.getBoundingClientRect();
        return new Point( rect.left, rect.top );
    }

    /**
     * Returns a value that represents the layout characteristics of a DOM element when it is hidden by invoking the {@link Sys.UI.DomElement.setVisible} method.
     * This member is static and can be invoked without creating an instance of the class.
     * @param element
     *      The target DOM element.
     * @returns
     *      A {@link Sys.UI.VisibilityMode} enumeration value that indicates the layout characteristics of element when it is hidden by invoking the setVisible method.
     */
    public static getVisibilityMode( element: HTMLElement )
    {
        return ( true ) ?
            VisibilityMode.hide :
            VisibilityMode.collapse;
    }

    // public static setVisibilityMode( element: HTMLElement, value: Sys.UI.VisibilityMode )
    // {
    //     Sys.UI.DomElement._ensureOldDisplayMode(element);
    //     if (element._visibilityMode !== value) {
    //         element._visibilityMode = value;
    //         if (Sys.UI.DomElement.getVisible(element) === false) {
    //             if (element._visibilityMode === Sys.UI.VisibilityMode.hide) {
    //                 element.style.display = element._oldDisplayMode;
    //             }
    //             else {
    //                 element.style.display = 'none';
    //             }
    //         }
    //         element._visibilityMode = value;
    //     }
    // }

    // public static getVisible = function( element: HTMLElement )
    // {
    //     var style = element.currentStyle || Sys.UI.DomElement._getCurrentStyle(element);
    //     if (!style) return true;
    //     return (style.visibility !== 'hidden') && (style.display !== 'none');
    // }

    // public static setVisible = function( element: HTMLElement, value: Sys.UI.VisibilityMode )
    // {
    //     if (value !== Sys.UI.DomElement.getVisible( element)) {
    //         Sys.UI.DomElement._ensureOldDisplayMode(element);
    //         element.style.visibility = value ? 'visible' : 'hidden';
    //         if (value || (element._visibilityMode === Sys.UI.VisibilityMode.hide)) {
    //             element.style.display = element._oldDisplayMode;
    //         }
    //         else {
    //             element.style.display = 'none';
    //         }
    //     }
    // }
}

export { DomElement }