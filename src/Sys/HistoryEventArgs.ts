namespace Sys
{
    export class HistoryEventArgs extends Sys.EventArgs
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

}