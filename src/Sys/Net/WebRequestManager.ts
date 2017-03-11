
import { XMLHttpExecutor } from "Sys/Net/XMLHttpExecutor"
import { NetworkRequestEventArgs } from "Sys/Net/NetworkRequestEventArgs"
import { WebRequest } from "Sys/Net/WebRequest"
import { WebRequestExecutor } from "Sys/Net/WebRequestExecutor"
import { EventHandlerList, EventHandler } from "Sys/EventHandlerList"
import { Res } from "Sys/Res"

/**
 * Manages the flow of the Web requests issued by the {@link WebRequest} object to the associated executor object.
 * The default executor associated with a WebRequest object is an instance of the XmlHttpExecutor class. The executor is responsible for making the actual network requests.
 * The WebRequestManager class defines the default behavior for all Web requests so that you do not have to specify low-level network configuration settings for each request.
 * Each page contains only one WebRequestManager instance. However, you might have several instances of the WebRequest class and related executor.
 */
class _WebRequestManager
{
	private _defaultTimeout = 0;
	private _defaultExecutorType = XMLHttpExecutor;

	private _events = new EventHandlerList();

	/**
	 * Registers a handler for processing the invoking request event of the WebRequestManager.
	 * @param handler
	 *      The function registered to handle the invoking request event.
	 */
	public add_invokingRequest( handler: EventHandler<_WebRequestManager, NetworkRequestEventArgs> )
	{
		this._get_eventHandlerList().addHandler( "invokingRequest", handler );
	}

	/**
	 * Removes the event handler set by the add_invokingRequest method. 
	 * Use the remove_invokingRequest method to remove the event handler you set using the add_invokingRequest method.
	 * @param handler
	 *          The function that handles the invoking request event.
	 */
	public remove_invokingRequest( handler: EventHandler<_WebRequestManager, NetworkRequestEventArgs> )
	{
		this._get_eventHandlerList().removeHandler( "invokingRequest", handler );
	}

	/**
	 * Registers a handler for the completed request event of the WebRequestManager.
	 * @param handler
	 * 		The function registered to handle the completed request event.
	 */
	public add_completedRequest( handler: EventHandler<_WebRequestManager, NetworkRequestEventArgs> )
	{
		this._get_eventHandlerList().addHandler( "completedRequest", handler );
	}

	/**
	 * Removes the event handler set by the add_completedRequest method. 
	 * Use the remove_ completedRequest method to remove the event handler you set using the add_ completedRequest method.
	 * @param handler
	 *      The function that handles the completed request event.
	 */
	public remove_completedRequest( handler: EventHandler<_WebRequestManager, NetworkRequestEventArgs> )
	{
		this._get_eventHandlerList().removeHandler( "completedRequest", handler );
	}

	public _get_eventHandlerList()
	{
		return this._events;
	}

	/**
	 * Gets or sets the time-out for the default network executor.
	 * @returns
	 *      An integer value that indicates the current time-out for the default executor.
	 */
	public get_defaultTimeout()
	{
		return this._defaultTimeout;
	}

	/**
	 * Gets or sets the time-out for the default network executor.
	 * @throws {@link ArgumentOutOfRangeException} An invalid parameter was passed.
	 * @param value
	 *          The time in milliseconds that the default executor should wait before timing out a Web request. This value must be 0 or a positive integer.
	 */
	public set_defaultTimeout( value: number )
	{
		if ( value < 0 )
		{
			throw Error.argumentOutOfRange( "value", value, Res.invalidTimeout );
		}
		this._defaultTimeout = value;
	}

	/**
	 * Gets or sets the default network executor type that is used to make network requests.
	 * @return 
	 *      The object that represents the default Web request executor.
	 */
	public get_defaultExecutorType()
	{
		return this._defaultExecutorType;
	}

	/**
	 * Gets or sets the default network executor type that is used to make network requests.
	 * @param value
	 *          A reference to an implementation of the WebRequestExecutor class.
	 */
	public set_defaultExecutorType( value: typeof XMLHttpExecutor )
	{
		this._defaultExecutorType = value;
	}

	/**
	 * Sends Web requests to the default network executor.
	 * @param webRequest
	 * 		An instance of the {@link WebRequest} class.
	 */
	public executeRequest( webRequest: WebRequest )
	{
		let executor = webRequest.get_executor();
		if ( !executor )
		{
			let failed = false;
			try
			{
				executor = new this._defaultExecutorType();
			}
			catch ( e )
			{
				failed = true;
			}
			if ( failed || !WebRequestExecutor.isInstanceOfType( executor ) || !executor )
			{
				throw Error.argument( "defaultExecutorType", String.format( Res.invalidExecutorType, this._defaultExecutorType.toString() ) );
			}
			webRequest.set_executor( executor );
		}
		if ( executor.get_aborted() )
		{
			return;
		}
		let evArgs = new NetworkRequestEventArgs( webRequest );
		let handler = this._get_eventHandlerList().getHandler( "invokingRequest" );
		if ( handler )
		{
			handler( this, evArgs );
		}
		if ( !evArgs.get_cancel() )
		{
			executor.executeRequest();
		}
	}
}

let WebRequestManager = new _WebRequestManager();

export { WebRequestManager }
