
import { Component, ComponentProps } from "../Component"

interface ControlProps extends ComponentProps
{}

class Control extends Component
{
    constructor( element: HTMLElement )
    {
        super();
        this._element = element;
    }

    protected _element: HTMLElement;

    public get_element()
    {
        return this._element;
    }
}

export { Control, ControlProps }
