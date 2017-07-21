namespace Sys.UI
{
    export class Behavior extends Sys.Component
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
}