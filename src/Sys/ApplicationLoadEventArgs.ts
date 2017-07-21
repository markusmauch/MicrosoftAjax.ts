namespace Sys
{
    export class ApplicationLoadEventArgs extends Sys.EventArgs
    {
        private _components: Sys.Component[] = [];
        private _isPartialLoad = false;

        constructor( components: Sys.Component[], isPartialLoad: boolean )
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
}