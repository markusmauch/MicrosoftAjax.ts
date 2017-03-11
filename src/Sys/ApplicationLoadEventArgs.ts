import { Component } from "Sys/Component"
import { EventArgs } from "Sys/EventArgs"

class ApplicationLoadEventArgs extends EventArgs
{
    private _components: Component[] = [];
    private _isPartialLoad = false;
    
    constructor( components: Component[], isPartialLoad: boolean )
    {
        super();
        this._components = components;
        this._isPartialLoad = isPartialLoad;
    }

    public get_components()
    {
        return this._components;
    }

    public get_isPartialLoad()
    {
        return this._isPartialLoad;
    }
}

export { ApplicationLoadEventArgs }