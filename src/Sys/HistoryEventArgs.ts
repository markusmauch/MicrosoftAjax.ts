import { EventArgs } from "Sys/EventArgs"

class HistoryEventArgs extends EventArgs
{
    private _state: PopStateEvent;

    constructor( state: PopStateEvent )
    {
        super();
    }

    public get_state()
    {
        return this._state;
    }
}

export { HistoryEventArgs }