import { EventArgs } from "Sys/EventArgs"

type EventHandler<TSender, TArgs> = ( sender: TSender, args?: EventArgs ) => void;

/**
 * Creates a dictionary of client events for a component, with event names as keys and the associated handlers as values.
 */
class EventHandlerList<TSender, TArgs>
{
	private _list:
	{
		[ id: string ]: EventHandler<TSender,
		TArgs>[]
	} = {};

    /**
     * Attaches a handler to an event in an {@link Sys.EventHandlerList} instance and adds the event to the list if it is not already present.
     * @param id
     *      A string that specifies the event.
     * @param handler
     *      The name of the method to handle the event.
     */
	public addHandler( id: string, handler: EventHandler<TSender, TArgs> ): void
	{
		let list = this._getEvent( id, true );
		if ( list !== null )
		{
			Array.add( list, handler );
		}
	}

    /**
     * Returns a single method that can be invoked to call all handlers sequentially for the specified event.
     * @param id
     *      The ID for the specified event.
     * @returns
     *      A single method that can be invoked to call all handlers sequentially for the specified event.
     */
	public getHandler( id: string ): EventHandler<TSender, TArgs> | null
	{
		let evt = this._getEvent( id );
		if ( !evt || ( evt.length === 0 ) ) return null;

		let clone = Array.clone( evt ) || [];
		return ( sender: TSender, args?: TArgs ) =>
		{
			//if ( args === undefined )
			//{
			//args = {};
			//}
			for ( let i = 0, l = clone.length; i < l; i++ )
			{
				clone[ i ]( sender, args );
			}
		};
	}

    /**
     * Removes an event handler from an event in an {@libnk Sys.EventHandlerList} instance.
     * @param id
     *      The ID for the event.
     * @param handler
     *      The handler to remove from the event.
     */
	public removeHandler( id: string, handler: EventHandler<TSender, TArgs> ): void
	{
		let list = this._getEvent( id, true );
		if ( list !== null )
		{
			Array.remove( list, handler );
		}
	}

	private _getEvent( id: string, create = false ): EventHandler<TSender, TArgs>[] | null
	{
		if ( this._list[ id ] === undefined )
		{
			if ( create === false ) return null;
			this._list[ id ] = [];
		}
		return this._list[ id ];
	}
}

export { EventHandler, EventHandlerList }
