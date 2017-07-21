namespace Sys
{
    declare class Control {};
    declare class Behavior {};

    export interface ComponentProps
    {
        id: string;
    }

    export interface ComponentEvents
    {
        disposing ? : Sys.EventHandler < Component, Sys.EventArgs > ;
        propertyChanged ? : Sys.EventHandler < Component, Sys.EventArgs > ;
    }

    export interface ComponentReferences
    {
        [ name: string ]: Component
    }

    /**
     * Provides the base class for the Control and Behavior classes, and for any other object whose lifetime should be managed by the ASP.NET AJAX client library.
     */
    export class Component
    {
        protected _initialized = false;
        private _disposed = false;
        private _updating = false;
        protected _id: string;
        protected _events = new Sys.EventHandlerList();

        /**
         * When overridden in a derived class, initializes an instance of that class and registers it with the application as a disposable object.
         */
        constructor()
        {
            if ( window[ "Application" ] !== undefined ) window[ "Application" ].registerDisposableObject( this );
        }

        public get_events()
        {
            return this._events;
        }

        /**
         * Gets the ID of the current Component object.
         * @returns
         *      A string that contains the ID of the component.
         */
        public get_id()
        {
            return this._id;
        }

        /**
         * Sets the ID of the current Component object.
         * @param id
         *      A string that contains the ID of the component.
         */
        public set_id( id: string )
        {
            this._id = id;
        }

        /**
         * Gets a value indicating whether the current Component object is initialized.
         * @returns
         *      true if the current Component is initialized; otherwise, false.
         */
        public get_isInitialized()
        {
            return this._initialized;
        }

        /**
         * Gets a value indicating whether the current Component object is updating.
         * @returns
         *      true if the current Component object is updating; otherwise, false.
         */
        public get_isUpdating()
        {
            return this._updating;
        }

        /**
         * Raised when the dispose method is called for a component.
         * @param handler
         *      The event handler function to add or remove.
         */
        public add_disposing( handler )
        {
            this.get_events().addHandler( "disposing", handler );
        }

        /**
         * Raised when the dispose method is called for a component.
         * @param handler
         *      The event handler function to add or remove.
         */
        public remove_disposing( handler )
        {
            this.get_events().removeHandler( "disposing", handler );
        }

        /**
         * Raised when the raisePropertyChanged method of the current Component object is called.
         * @param handler
         *      The event handler function to add or remove.
         */
        public add_propertyChanged( handler )
        {
            this.get_events().addHandler( "propertyChanged", handler );
        }

        /**
         * Raised when the raisePropertyChanged method of the current Component object is called.
         * @param handler
         *      The event handler function to add or remove.
         */
        public remove_propertyChanged( handler )
        {
            this.get_events().removeHandler( "propertyChanged", handler );
        }

        /**
         * Called by the create method to indicate that the process of setting properties of a component instance has begun.
         */
        public beginUpdate()
        {
            this._updating = true;
        }

        public dispose()
        {
            if ( this._disposed === false )
            {
                // do dispose

                this._disposed = true;
            }
        }

        /**
         * Called by the create method to indicate that the process of setting properties of a component instance has finished.
         */
        public endUpdate()
        {
            this._updating = false;
            if ( !this._initialized ) this.initialize();
            this.updated();
        }

        public initialize()
        {
            this._initialized = true;
        }

        public updated()
        {}

        public static _setReferences( component: Component, references: ComponentReferences )
        {
            for ( let name in references )
            {
                let setter = component[ "set_" + name ] as Function;
                let reference = references[ name ]; // $find( name ); // TODO
                if ( typeof ( setter ) !== "function" )
                {
                    throw Error.invalidOperation( String.format( Sys.Res.propertyNotWritable, name ) );
                }
                if ( !reference )
                {
                    throw Error.invalidOperation( String.format( Sys.Res.referenceNotFound, name ) );
                }
                setter.apply( component, [ reference ] );
            }
        }

        public static _setProperties( target: Component, properties: ComponentProps )
        {
            let current;
            let targetType = Object.getType( target );
            let isObject = ( targetType === Object ) || ( targetType === Sys.UI.DomElement );
            let isComponent = Component.isInstanceOfType( target ) && !target.get_isUpdating();

            for ( let name in properties )
            {
                let val = properties[ name ];
                let getter = isObject ? null : target[ "get_" + name ];
                if ( isObject || typeof( getter ) !== 'function' )
                {
                    let targetVal = target[ name ];
                    if ( !isObject && typeof( targetVal ) === 'undefined' ) throw Error.invalidOperation( String.format( Sys.Res.propertyUndefined, name ) );
                    if ( !val || ( typeof( val ) !== 'object' ) || ( isObject && !targetVal ) )
                    {
                        target[ name ] = val;
                    }
                    else
                    {
                        Component._setProperties( targetVal, val );
                    }
                }
                else
                {
                    let setter = target[ "set_" + name ];
                    if ( typeof( setter ) === 'function' )
                    {
                        setter.apply( target, [ val ] );
                    }
                    else if ( val instanceof Array )
                    {
                        current = getter.apply( target );
                        if ( !( current instanceof Array ) )
                        {
                            throw Error.invalidOperation( String.format( Sys.Res.propertyNotAnArray, name ) );
                        }
                        for ( let i = 0, j = current.length, l = val.length; i < l; i++, j++ )
                        {
                            current[ j ] = val[ i ];
                        }
                    }
                    else if ( ( typeof( val ) === 'object' ) && ( Object.getType( val ) === Object ) )
                    {
                        current = getter.apply( target );
                        if ( ( typeof( current ) === 'undefined' ) || ( current === null ) )
                        {
                            throw Error.invalidOperation( String.format( Sys.Res.propertyNullOrUndefined, name ) );
                        }
                        Component._setProperties( current, val );
                    }
                    else
                    {
                        throw Error.invalidOperation( String.format( Sys.Res.propertyNotWritable, name ) );
                    }
                }
            }
        }
    }
}