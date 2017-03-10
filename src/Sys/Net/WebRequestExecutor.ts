
import { WebRequest } from "./WebRequest"
import { JavaScriptSerializer} from "../Serialization/JavaScriptSerializer"

/**
 * Provides the abstract base class from which network executors derive.
 * @see {@link http://msdn.microsoft.com/en-us/library/bb397434(v=vs.100).aspx}
 */
abstract class WebRequestExecutor
{
	protected _webRequest: WebRequest;
	protected _resultObject;

	/**
	 * Gets the WebRequest object associated with the executor.
	 * @returns
	 * 		The WebRequest object associated with the current executor instance.
	 */
	public get_webRequest()
	{
		return this._webRequest;
	}

	/**
	 * Sets the WebRequest object associated with the executor.
	 * @param value
	 * 		The WebRequest object associated with the current executor instance.
	 */
	public _set_webRequest( value: WebRequest )
	{
		this._webRequest = value;
	}

	/**
	 * Returns a value indicating whether the executor has started processing the request.
	 * The executor returns true if substantial processing of the request has started. For executors that make network calls, substantial processing means that a network call has been started.
	 * @returns
	 * 		true if the executor has started processing the request; otherwise, false.
	 */
	public abstract get_started(): boolean;

	/**
	 * Gets a value indicating whether the request completed successfully.  
	 * Successful completion usually means a well-formed response was received by the executor. 
	 * If a response was received, the current instance of the Sys.Net.WebRequestExecutor class must set its state to completed. 
	 * It must also raise the completed event of the associated request object.
	 * @returns
	 * 		true if the request completed successfully; otherwise, false.
	 */
	public abstract get_responseAvailable(): boolean;

	/**
	 * Gets a value indicating whether the request timed out.
	 * Executors use the time-out information associated with the request to raise the completed event on the associated WebRequest object.
	 * @return true if the request timed out; otherwise, false. 
	 */		
	public abstract get_timedOut(): boolean;

	/**
	 * Gets a value indicating whether the request associated with the executor was aborted.  
	 * When the current instance of the Sys.Net.WebRequestExecutor class is aborted, it must set its state to aborted and it must raise the completed event of the associated request object.
	 * @returns
	 * 		true if the request associated with the executor was aborted; otherwise, false.
	 */
	public abstract get_aborted(): boolean;

	/**
	 * Gets the text representation of the response body. When a request has completed successfully with valid response data, this property returns the text that is contained in the response body. 
	 * @returns
	 * 		The text representation of the response body.
	 */
	public abstract get_responseData(): string;

	/**
	 * Gets a success status code.
	 * The statusCode property returns an integer that specifies that a request completed successfully and with valid response data.
	 * @returns
	 * 		An integer that represents a status code.
	 */
	public abstract get_statusCode(): number;

	/**
	 * Gets status information about a request that completed successfully.   
	 * The statusText property returns status information if a request completed successfully and with valid response data.
	 * @returns
	 * 		The status text.
	 */
	public abstract get_statusText(): string;

	/**
	 * Attempts to get the response to the current request as an XMLDOM object.
	 * If a request finished successfully with valid response data, this method tries to get the response as an XMLDOM object.  
	 */
	public abstract get_xml(): Document | null;

	/**
	 * Gets the JSON-evaluated object from the response.
	 * @returns
	 * 		The JSON-evaluated response object.
	 */
	public get_object()
	{
		if ( !this._resultObject )
		{
			this._resultObject = JavaScriptSerializer.deserialize( this.get_responseData() );
		}
		return this._resultObject;
	}

	/**
	 * Instructs the executor to execute a Web request.  
	 * When this method is called, the executor packages the content of the Web request instance and initiates processing.
	 * This method is intended to be used by a custom executor. If you are implementing a custom executor, you instantiate the executor, assign it to the Web request instance, and then invoke the method on the executor instance.
	 * @see {@link http://msdn.microsoft.com/en-us/library/bb383834(v=vs.100).aspx}
	 */
	public abstract executeRequest();

	/**
	 * Stops the pending network request issued by the executor.
	 * The specifics of aborting a request vary depending on how an executor is implemented. 
	 * However, all executors that derive from WebRequestExecutor must set their state to aborted and must raise the completed event of the associated Sys.Net.WebRequest object.
	 * The executor properties do not contain consistent data after abort has been called.
	 */
	public abstract abort();

	/**
	 * Gets all the response headers for the current request.
	 * If a request finished successfully and with valid response data, this method returns all the response headers.  
	 * @returns
	 * 		All the response headers
	 * @see {@link http://msdn.microsoft.com/en-us/library/bb310805(v=vs.100).aspx}
	 */
	public abstract getAllResponseHeaders(): string;
	
	/**
	 * Gets the value of the specified response header.
	 * @return
	 * 		The specified response header.
	 */
	public abstract getResponseHeader( key: string ): string;
}

export { WebRequestExecutor }