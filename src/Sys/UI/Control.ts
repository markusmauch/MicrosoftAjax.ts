import { Component, ComponentProps } from "../Component"

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

interface ControlProps extends ComponentProps
{}

export { Control, ControlProps }