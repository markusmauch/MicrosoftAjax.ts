import { Res } from "Sys/Res"
import { EventHandler } from "Sys/EventHandlerList"
import { Component, ComponentReferences } from "Sys/Component"
import { EventArgs } from "Sys/EventArgs"
import { ApplicationLoadEventArgs } from "Sys/ApplicationLoadEventArgs"
import { HistoryEventArgs } from "Sys/HistoryEventArgs"
import { DomEvent } from "Sys/UI/DomEvent"

interface Test<T>
{
	test: T;
}

interface IContainer
{
	findComponent( id: string, parent?: IContainer ): Component;
}

/**
 * Provides a run-time object that exposes client events and manages client components that are registered with the application. 
 * The members of this object are available globally after the client application has been initialized. 
 * The members can be invoked without creating an instance of the class.
 * @see {@link http://msdn.microsoft.com/en-us/library/bb384161(v=vs.100).aspx}
 */
class _Application extends Component implements IContainer
{
	private _disposableObjects: Component[] = [];
	private _creatingComponents = false;
	private _components: ComponentReferences = {};
	public _createdComponents: Component[] = [];
	private _secondPassComponents: { component: Component, references: ComponentReferences }[] = [];
	private _disposing = false;
	private _loaded = false;
	private _timerCookie = 0;

	constructor()
	{
		super();

		window.addEventListener( "unload", this._unloadHandler  );
		window.addEventListener( "popstate", this._raiseNavigate );
		this._domReady();
	}

    /**
     * Gets a value that indicates whether the application is in the process of creating components. This member is static and can be invoked without creating an instance of the class.
     */
	public get_isCreatingComponents(): boolean
	{
		let x: EventListenerOrEventListenerObject;
		return this._creatingComponents;
	}

    /**
     * Gets or sets a value that indicates whether the Web application supports history point management.
     */
	public get_enableHistory(): boolean
	{
		return true;
	}

    /**
     * Gets or sets a value that indicates whether the Web application supports history point management.
     * @param value
     *           true to allow the Web application to support history points, or false to not allow history points.
     */
	public set_enableHistory( value: boolean ): void { }

    /**
     * Raised after all scripts have been loaded but before objects are created.
     */
	public add_init( handler: EventHandler<_Application, EventArgs> )
	{
		if ( this._initialized )
		{
			handler( this, EventArgs.Empty );
		}
		else
		{
			this.get_events().addHandler( "init", handler );
		}
	}

    /**
     * Raised after all scripts have been loaded but before objects are created.
     */
	public remove_init( handler: EventHandler<_Application, EventArgs> )
	{
		this.get_events().removeHandler( "init", handler );
	}

    /**
     * Raised after all scripts have been loaded and after the objects in the application have been created and initialized.
     */
	public add_load( handler: EventHandler<_Application, ApplicationLoadEventArgs> )
	{
		this.get_events().addHandler( "load", handler );
	}

    /**
     * Raised after all scripts have been loaded and after the objects in the application have been created and initialized.
     */
	public remove_load( handler: EventHandler<_Application, ApplicationLoadEventArgs> )
	{
		this.get_events().removeHandler( "load", handler );
	}

    /**
     * Occurs when the user clicks the browser's Back or Forward button.
     */
	public add_navigate( handler: EventHandler<_Application, HistoryEventArgs> )
	{
		this.get_events().addHandler( "navigate", handler );
	}

    /**
     * Occurs when the user clicks the browser's Back or Forward button.
     */
	public remove_navigate( handler: EventHandler<_Application, HistoryEventArgs> )
	{
		this.get_events().removeHandler( "navigate", handler );
	}

    /** 
     * Raised before all objects in the client application are disposed, typically when the DOM window.unload event is raised.
     */
	public add_unload( handler: EventHandler<any, any> ): void
	{
		this.get_events().addHandler( "unload", handler );
	}

    /** 
     * Raised before all objects in the client application are disposed, typically when the DOM window.unload event is raised.
     */
	public remove_unload( handler: EventHandler<any, any> )
	{
		this.get_events().removeHandler( "unload", handler );
	}

    /**
     * Registers a component with the application and initializes it if the component is not already initialized.
     */
	public addComponent( component: Component ): void
	{
		let id = component.get_id();
		if ( !id ) throw Error.invalidOperation( Res.cantAddWithoutId );
		if ( this._components[ id ] !== undefined )
		{
			throw Error.invalidOperation( String.format( Res.appDuplicateComponent, id ) );
		}
		this._components[ id ] = component;
	}

    /**
     * Instructs the application to start creating components.
     */
	public beginCreateComponents(): void
	{
		this._creatingComponents = true;
	}

    /**
     * Creates a history point and adds it to the browser's history stack.
     */
	public addHistoryPoint( state: Object, title?: string ): void
	{
		history.pushState( state, title );
	}

    /**
     * Releases resources and dependencies held by the client application.
     */
	public dispose(): void
	{
		if ( !this._disposing )
		{
			this._disposing = true;
			if ( this._timerCookie )
			{
				window.clearTimeout( this._timerCookie );
				delete this._timerCookie;
			}
			// if ( this._endRequestHandler )
			// {
			// 	Sys.WebForms.PageRequestManager.getInstance().remove_endRequest( this._endRequestHandler );
			// 	delete this._endRequestHandler;
			// }
			// if ( this._beginRequestHandler )
			// {
			// 	Sys.WebForms.PageRequestManager.getInstance().remove_beginRequest( this._beginRequestHandler );
			// 	delete this._beginRequestHandler;
			// }
			
			let unloadHandler = this.get_events().getHandler( "unload" );
			if ( unloadHandler )
			{
				unloadHandler( this, EventArgs.Empty );
			}
			let disposableObjects = Array.clone( this._disposableObjects );
			for ( let i = 0, l = disposableObjects.length; i < l; i++ )
			{
				let object = disposableObjects[ i ];
				if ( object !== undefined )
				{
					object.dispose();
				}
			}
			Array.clear( this._disposableObjects );
			DomEvent.removeHandler( window, "unload", this._unloadHandler );
			
			// if ( Sys._ScriptLoader )
			// {
			// 	let sl = Sys._ScriptLoader.getInstance();
			// 	if ( sl )
			// 	{
			// 		sl.dispose();
			// 	}
			// }
			
			super.dispose();
		}
	}

    /**
     * Releases resources and dependencies associated with an element and its child nodes.
     * @param element
     *           The element to dispose.
     * @param childNodesOnly
     *           A boolean value used to determine whether to dispose of the element and its child nodes or to dispose only its child nodes.
     */
	public disposeElement( element: Element, childNodesOnly: boolean ): void { }

    /**
     * Instructs the application to finalize component creation.
     */
	public endCreateComponents(): void { }

    /**
     * Called by the Sys.Application.endCreateComponents Method to indicate that the process of updating the application has completed.
     */
	public endUpdate(): void { }

    /**
     * Returns an array of all components that have been registered with the application by using the addComponent method. This member is static and can be invoked without creating an instance of the class.
     */
	public getComponents(): Component[]
	{
		return [ new Component() ];
	}

    /**
     * This function supports the client-script infrastructure and is not intended to be used directly from your code.
     */
	public initialize(): void
	{
		if ( !this.get_isInitialized() && !this._disposing )
		{
			super.initialize();
			this._raiseInit();
			// TODO
            /*if ( this.get_stateString )
            {
                if ( Sys.WebForms && Sys.WebForms.PageRequestManager )
                {
                    this._beginRequestHandler = Function.createDelegate( this, this._onPageRequestManagerBeginRequest );
                    Sys.WebForms.PageRequestManager.getInstance().add_beginRequest( this._beginRequestHandler );
                    this._endRequestHandler = Function.createDelegate( this, this._onPageRequestManagerEndRequest );
                    Sys.WebForms.PageRequestManager.getInstance().add_endRequest( this._endRequestHandler );
                }
                var loadedEntry = this.get_stateString();
                if ( loadedEntry !== this._currentEntry )
                {
                    this._navigate( loadedEntry );
                }
                else
                {
                    this._ensureHistory();
                }
            }*/
			this.raiseLoad();
		}
	}

    /**
     * Called by a referenced script to indicate that it has been loaded. This API is obsolete. You no longer need to call this method in order to notify the Microsoft Ajax Library that the JavaScript file has been loaded.
     */
	public notifyScriptLoaded(): void { }

    /** 
     * Raises the Sys.INotifyPropertyChange.propertyChanged event.
     */
	public raisePropertyChanged( propertyName: string ): void { }

    /**
     * Called by the Sys.Application.endUpdate method as a placeholder for additional logic.
     */
	public updated(): void { }

    /**
     * Returns the specified Component object. This member is static and can be invoked without creating an instance of the class.
     * @return A Component object that contains the component requested by ID, if found; otherwise, null.
     */
	public findComponent( id: string, parent?: IContainer ): Component
	{
		if ( parent !== undefined )
		{
			return parent.findComponent( id );
		}

		return this._components[ id ] || null;
	}

    /**
     * Raises the load event. This member is static and can be invoked without creating an instance of the class.
     */
	public raiseLoad(): void
	{
		var h = this.get_events().getHandler( "load" );
		var args = new ApplicationLoadEventArgs( Array.clone( this._createdComponents ), !!this._loaded );
		this._loaded = true;
		if ( h )
		{
			h( this, args );
		}
        /*if ( window.pageLoad )
        {
            window.pageLoad( this, args );
        }*/
		this._createdComponents = [];
	}

    /**
     * Registers with the application an object that will require disposing. This member is static and can be invoked without creating an instance of the class.
     */
	public registerDisposableObject( object: Component ): void { }

    /**
     * Removes the object from the application and disposes the object if it is disposable. This member is static and can be invoked without creating an instance of the class.
     */
	public removeComponent( component: Component ): void { }

    /**
     * Unregisters a disposable object from the application. This member is static and can be invoked without creating an instance of the class.
     */
	public unregisterDisposableObject( object: any ): void { }

    /**
     * Gets a value that indicates whether the application is in the process of disposing its resources. This member is static and can be invoked without creating an instance of the class.
     */
	public get_isDisposing(): boolean
	{
		return this._disposing;
	}

	private _domReady()
	{

		let init = () =>
		{
			this.initialize();
		}

		let onload = () =>
		{
			DomEvent.removeHandler( window, "load", onload );
			init();
		}

		DomEvent.addHandler( window, "load", onload );

		try
		{
			let check = () =>
			{
				document.removeEventListener( "DOMContentLoaded", check, false );
				init();
			};
			document.addEventListener( "DOMContentLoaded", check, false );
		}
		catch ( er ) { }
	}

	private _raiseInit()
	{
		let handler = this.get_events().getHandler( "init" );
		if ( handler )
		{
			this.beginCreateComponents();
			handler( this, EventArgs.Empty );
			this.endCreateComponents();
		}
	}

	private _raiseNavigate( e: PopStateEvent )
	{
		let handler = this.get_events().getHandler( "navigate" );
		let args = new HistoryEventArgs( e );
		
		if ( handler )
		{
			handler( this, args );
		}
	}

	private _unloadHandler()
	{
		this.dispose();
	}

	public _addComponentToSecondPass( component: Component, references: any )
	{
		this._secondPassComponents.push( { component: component, references: references });
	}
}

let Application = new _Application();

export { Application, IContainer }
