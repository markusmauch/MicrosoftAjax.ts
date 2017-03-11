
import { MouseButton } from "Sys/UI/MouseButton"

class DomEvent
{
    /**
     * Initializes a new instance of the Sys.UI.DomEvent class and associates it with the specified HTMLElement object.
     * @param domElement
     *           The HTMLElement object to associate with the event.
     */
    constructor( domElement: EventTarget )
    {}

    /**
     * Provides a method to add a DOM event handler to the DOM element that exposes the event. This member is static and can be invoked without creating an instance of the class.
     * Use the addHandler method to add a DOM event handler to the element that exposes the event. The eventName parameter should not include the "on" prefix. For example, specify "click" instead of "onclick".
     * This method can be accessed through the $addHandler shortcut method.
     * 
     * @param element
     *          The element that exposes the event.
     * @param eventName
     *          The name of the event.
     * @param handler
     *          The client function that is called when the event occurs.
     * @param autoRemove
     *          (Optional) A boolean value that determines whether the handler should be removed automatically when the element is disposed.
     */
    public static addHandler( element: EventTarget, eventName: string, handler: ( e: DomEvent ) => void, autoRemove ? : boolean ): void
    {
        let wrapper = ev =>
        {
            handler( new DomEvent( element ) );
        };
        element.addEventListener( eventName, wrapper );
    }

    /**
     * Adds a list of DOM event handlers to the DOM element that exposes the events. This member is static and can be invoked without creating an instance of the class.
     * Use the addHandlers method to add a list of DOM event handlers to the element that exposes the event.
     * The events parameter takes a comma-separated list of name/value pairs in the format name:value, where name is the name of the DOM event and value is the name of the handler function.
     * If there is more than one name/value pair, the list must be enclosed in braces ({}) to identify it as a single parameter. Multiple name/value pairs are separated with commas. 
     * Event names should not include the "on" prefix. For example, specify "click" instead of "onclick".
     * If handlerOwner is specified, delegates are created for each handler. These delegates are attached to the specified object instance, and the this pointer from the delegate handler will refer to the handlerOwner object.
     * This method can be accessed through the $addHandlers shortcut method.
     * 
     * @param element
     *          The DOM element that exposes the events.
     * @param events
     *          A dictionary of event handlers.
     * @param handlerOwner
     *          (Optional) The object instance that is the context for the delegates that should be created from the handlers.
     * @param autoRemove 
     *          (Optional) A boolean value that determines whether the handler should be removed automatically when the element is disposed.
     * 
     * @throws Error.invalidOperation - (Debug) One of the handlers specified in events is not a function.
     *  
     */
    public static addHandlers( element: HTMLElement, events:
    {
        [ event: string ]: ( e: DomEvent ) => void
    }, handlerOwner ? : any, autoRemove ? : boolean ): void
    {}

    /**
     * Removes all DOM event handlers from a DOM element that were added through the Sys.UI.DomEvent addHandler or the Sys.UI.DomEvent addHandlers methods.
     * This member is static and can be invoked without creating an instance of the class.
     * This method can be accessed through the $clearHandlers shortcut method.
     * 
     * @param element
     *          The element that exposes the events.
     */
    public static clearHandlers( element: EventTarget ): void
    {}

    /**
     * Removes a DOM event handler from the DOM element that exposes the event. This member is static and can be invoked without creating an instance of the class.
     * 
     * @param element
     *          The element that exposes the event.
     * @param eventName
     *          The name of the event.
     * @param handler
     *          The event handler to remove.
     */
    static removeHandler( element: EventTarget, eventName: string, handler: ( e: DomEvent ) => void ): void
    {}

    /**
     * Prevents the default DOM event action from happening.
     * Use the preventDefault method to prevent the default event action for the browser from occurring. 
     * For example, if you prevent the keydown event of an input element from occurring, the character typed by the user is not automatically appended to the input element's value.
     */
    public preventDefault(): void
    {}

    /**
     * Prevents an event from being propagated (bubbled) to parent elements.
     * By default, event notification is bubbled from a child object to parent objects until it reaches the document object. 
     * The event notification stops if the event is handled during the propagation process. 
     * Use the stopPropagation method to prevent an event from being propagated to parent elements.
     */
    
    public stopPropagation(): void
    {}

    /**
     * Gets a Boolean value that indicates the state of the ALT key when the associated event occurred.
     * Use the altKey field to determine whether the ALT key is pressed when the event occurred.
     * 
     * @return true if the ALT key was pressed when the event occurred; otherwise, false.
     */
    public altKey: boolean;
    
    /**
     * Gets a Sys.UI.MouseButton enumeration value that indicates the button state of the mouse when the related event occurred.
     * Use the button field to determine which mouse button was pressed when the related event occurred.
     * @return A MouseButton value
     */
    public button: MouseButton;
    
    /**
     * Gets the character code of the key that raised the associated keyPress event.
     * Use the charCode field to get the character code of a pressed key or key combination that raised a keyPress event.
     * The keyPress event provides a single character code that identifies key combinations. 
     * The keyPress event is not raised for single modifier keys such as ALT, CTRL, and SHIFT.
     * 
     * @return An integer value that represents the character code of the key or key combination that was pressed to raise the keyPress event.
     */
    public charCode: number;
    
    /**
     * Gets the x-coordinate of the mouse pointer's position relative to the client area of the browser window, excluding window scroll bars.
     * @return An integer that represents the x-coordinate in pixels.
     */
    public clientX: number;

    /**
     * Gets the y-coordinate of the mouse pointer's position relative to the client area of the browser window, excluding window scroll bars.
     * @return An integer that represents the y-coordinate in pixels.
     */
    public clientY: number;

    /**
     * Gets a Boolean value that indicates the state of the CTRL key when the associated event occurred.
     * @return true if the CTRL key was pressed when the event occurred; otherwise, false.
     */
    public ctrlKey: boolean;

    /**
     * Gets the key code of the key that raised the keyUp or keyDown event.
     * @return An integer value that represents the key code of the key that was pressed to raise the keyUp or keyDown event.
     */
    public keyCode: number;

    /**
     * Gets the x-coordinate of the mouse pointer's position relative to the object that raised the event.
     * @return An integer that represents the x-coordinate in pixels.
     */
    public offsetX: number;

    /**
     * Gets the y-coordinate of the mouse pointer's position relative to the object that raised the event.
     * @return An integer that represents the y-coordinate in pixels.
     */
    public offsetY: number;

    /**
     * Gets the x-coordinate of the mouse pointer's position relative to the user's screen.
     * @return An integer that represents the x-coordinate in pixels.
     */
    public screenX: number;

    /**
     * Gets the y-coordinate of the mouse pointer's position relative to the user's screen.
     * @return An integer that represents the y-coordinate in pixels.
     */
    public screenY: number;

    /**
     * Gets a Boolean value that indicates the state of the SHIFT key when the associated event occurred.
     * @return true if the SHIFT key was pressed when the event occurred; otherwise, false.
     */
    public shiftKey: boolean;

    /**
     * Gets the object that the event acted on.
     * @return An object that represents the target that the event acted on.
     */
    public target: any;

    /**
     * Gets the name of the event that was raised.
     * @return A string that represents the name of the event that was raised.
     */
    public type: string;
}

export { DomEvent }