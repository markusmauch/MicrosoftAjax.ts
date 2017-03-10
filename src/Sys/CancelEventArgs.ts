
module Sys
{
    /**
     * Provides the base class for events that can be canceled.
     */
	export class CancelEventArgs
	{
		private _cancel = false;

		/**
         * Gets value that specifies whether the event source should cancel the operation that caused the event. 
         */
        public get_cancel()
		{
			return this._cancel;
		}

        /**
         * Sets a value that specifies whether the event source should cancel the operation that caused the event. 
         */
		public set_cancel( value: boolean )
		{
			this._cancel = value;
		}
	}
}
