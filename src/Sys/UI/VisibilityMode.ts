/**
 * Describes the layout of a DOM element in the page when the element's visible property is set to false.
 */
enum VisibilityMode
{
    /**
     * The element is not visible, but it occupies space on the page.
     */
    hide,

    /**
     * The element is not visible, and the space it occupies is collapsed.
     */
    collapse,
}

export { VisibilityMode }