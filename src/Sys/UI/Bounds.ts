 
class Bounds
{
    /**
     * Initializes a new instance of the Sys.UI.Bounds class.
     * @param x
     *      The number of pixels between the location and the left edge of the parent frame.
     * @param y
     *    The number of pixels between the location and the top edge of the parent frame.
     * @param width
     *    The width in pixels.
     * @param height
     *    The height in pixels.
     */
    constructor( public x = 0, public y = 0, public width = 0, public height = 0 )
    {}
}

export { Bounds }