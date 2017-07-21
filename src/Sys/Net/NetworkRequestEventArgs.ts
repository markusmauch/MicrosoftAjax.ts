
namespace Sys.Net
{
	/**
	 * Contains information about a Web request that is ready to be sent to the current Sys.Net.WebRequestExecutor instance.
	 */
	export class NetworkRequestEventArgs extends Sys.CancelEventArgs
	{
		private _webRequest: Sys.Net.WebRequest;

		/**
		 * Initializes a new instance of the {@link Sys.Net.NetworkRequestEventArgs} class.
		 */
		constructor( webRequest: Sys.Net.WebRequest )
		{
			super();
			this._webRequest = webRequest;
		}

		/**
		 * Gets the Web request to be routed to the current Sys.Net.WebRequestExecutor instance.
		 */
		public get_webRequest()
		{
			return this._webRequest;
		}
	}
}