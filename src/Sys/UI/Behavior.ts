
import { Component } from "Sys/Component"

class Behavior extends Component
{
    constructor( element: HTMLElement )
    {
        super();
        this._element = element;
    }

    private _element: HTMLElement;

    public get_element()
    {
        return this._element;
    }
}

export { Behavior }