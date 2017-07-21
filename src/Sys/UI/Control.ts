namespace Sys.UI
{
    export interface ControlProps extends Sys.ComponentProps
    {}

    export class Control extends Sys.Component
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
}