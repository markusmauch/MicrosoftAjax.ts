namespace Sys.UI
{
    export class Point
    {
        /**
         * Creates an object that contains a set of integer coordinates that represent a position.
         * @param x
         *      Gets the x-coordinate of the Point object in pixels. This property is read-only.
         * @param y
         *      Gets the y-coordinate of the Point object in pixels. This property is read-only.
         */
        constructor( public readonly x = 0, public readonly y = 0 )
        {}
    }
}