
namespace Sys.Serialization
{
	export namespace JavaScriptSerializer
	{

		let _charsToEscapeRegExs: string[] = [];
		let _charsToEscape: string[] = [];
		let _dateRegEx = new RegExp( '(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+)(?:[a-zA-Z]|(?:\\+|-)[0-9]{4})?\\)\\\\/\\"', 'g' );
		let _escapeChars:
		{
			[ key: string ]: string
		} = {};
		let _escapeRegEx = new RegExp( '["\\\\\\x00-\\x1F]', 'i' );
		let _escapeRegExGlobal = new RegExp( '["\\\\\\x00-\\x1F]', 'g' );
		let _jsonRegEx = new RegExp( '[^,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t]', 'g' );
		let _jsonStringRegEx = new RegExp( '"(\\\\.|[^"\\\\])*"', 'g' );
		let _serverTypeFieldName = "__type";

		function _init()
		{
			let replaceChars = [
				'\\u0000', '\\u0001', '\\u0002', '\\u0003', '\\u0004', '\\u0005', '\\u0006', '\\u0007',
				'\\b', '\\t', '\\n', '\\u000b', '\\f', '\\r', '\\u000e', '\\u000f', '\\u0010', '\\u0011',
				'\\u0012', '\\u0013', '\\u0014', '\\u0015', '\\u0016', '\\u0017', '\\u0018', '\\u0019',
				'\\u001a', '\\u001b', '\\u001c', '\\u001d', '\\u001e', '\\u001f' ];

			_charsToEscape[ 0 ] = '\\';
			_charsToEscapeRegExs[ '\\' ] = new RegExp( '\\\\', 'g' );
			_escapeChars[ '\\' ] = '\\\\';
			_charsToEscape[ 1 ] = '"';
			_charsToEscapeRegExs[ '"' ] = new RegExp( '"', 'g' );
			_escapeChars[ '"' ] = '\\"';

			for ( var i = 0; i < 32; i++ )
			{
				var c = String.fromCharCode( i );
				_charsToEscape[ i + 2 ] = c;
				_charsToEscapeRegExs[ c ] = new RegExp( c, 'g' );
				_escapeChars[ c ] = replaceChars[ i ];
			}
		}

		_init();

		/**
		 * Converts an ECMAScript (JavaScript) object graph into a JSON string. This member is static and can be invoked without creating an instance of the class.
		 * @param object
		 *      The JavaScript object graph to serialize.
		 */
		export function serialize( object ): string
		{
			let stringBuilder = new Sys.StringBuilder();
			_serializeWithBuilder( object, stringBuilder, false );
			return stringBuilder.toString();
		}

		/**
		 * Converts a JSON string into an ECMAScript (JavaScript) object graph. This member is static and can be invoked without creating an instance of the class.
		 * @param value
		 *      The JSON string to deserialize.
		 */
		export function deserialize( data: string, secure?: boolean )
		{
			if ( data.length === 0 ) throw Error.argument( 'data', Sys.Res.cannotDeserializeEmptyString );
			try
			{
				var exp = data.replace( _dateRegEx, "$1new Date($2)" );

				if ( secure && _jsonRegEx.test( exp.replace( _jsonStringRegEx, '' ) ) ) throw null;
				return eval( '(' + exp + ')' );
			}
			catch ( e )
			{
				throw Error.argument( 'data', Sys.Res.cannotDeserializeInvalidJson );
			}
		}

		function _serializeBooleanWithBuilder( object: any, stringBuilder: Sys.StringBuilder )
		{
			stringBuilder.append( object.toString() );
		}

		function _serializeNumberWithBuilder( object: any, stringBuilder: Sys.StringBuilder )
		{
			if ( isFinite( object ) )
			{
				stringBuilder.append( String( object ) );
			}
			else
			{
				throw Error.invalidOperation( Sys.Res.cannotSerializeNonFiniteNumbers );
			}
		}

		function _serializeStringWithBuilder( string: string, stringBuilder: Sys.StringBuilder )
		{
			stringBuilder.append( '"' );
			if ( _escapeRegEx.test( string ) )
			{
				if ( _charsToEscape.length === 0 )
				{
					_init();
				}
				if ( string.length < 128 )
				{
					string = string.replace( _escapeRegExGlobal,
						function( x )
						{
							return _escapeChars[ x ];
						} );
				}
				else
				{
					for ( var i = 0; i < 34; i++ )
					{
						var c = _charsToEscape[ i ];
						if ( string.indexOf( c ) !== -1 )
						{
							if ( Sys.Browser.agent === Sys.Browser.Opera || Sys.Browser.agent === Sys.Browser.FireFox )
							{
								string = string.split( c ).join( _escapeChars[ c ] );
							}
							else
							{
								string = string.replace( _charsToEscapeRegExs[ c ], _escapeChars[ c ] );
							}
						}
					}
				}
			}
			stringBuilder.append( string );
			stringBuilder.append( '"' );
		}

		function _serializeWithBuilder( object: any, stringBuilder: Sys.StringBuilder, sort: boolean, prevObjects ? : any[] )
		{
			var i;
			switch ( typeof object )
			{
				case 'object':
					if ( object )
					{
						if ( prevObjects )
						{
							for ( var j = 0; j < prevObjects.length; j++ )
							{
								if ( prevObjects[ j ] === object )
								{
									throw Error.invalidOperation( Sys.Res.cannotSerializeObjectWithCycle );
								}
							}
						}
						else
						{
							prevObjects = [];
						}
						try
						{
							Array.add( prevObjects, object );

							if ( Number.isInstanceOfType( object ) )
							{
								_serializeNumberWithBuilder( object, stringBuilder );
							}
							else if ( Boolean.isInstanceOfType( object ) )
							{
								_serializeBooleanWithBuilder( object, stringBuilder );
							}
							else if ( String.isInstanceOfType( object ) )
							{
								_serializeStringWithBuilder( object, stringBuilder );
							}

							else if ( Array.isInstanceOfType( object ) )
							{
								stringBuilder.append( '[' );

								for ( i = 0; i < object.length; ++i )
								{
									if ( i > 0 )
									{
										stringBuilder.append( ',' );
									}
									_serializeWithBuilder( object[ i ], stringBuilder, false, prevObjects );
								}
								stringBuilder.append( ']' );
							}
							else
							{
								if ( Date.isInstanceOfType( object ) )
								{
									stringBuilder.append( '"\\/Date(' );
									stringBuilder.append( object.getTime() );
									stringBuilder.append( ')\\/"' );
									break;
								}
								var properties: string[] = [];
								var propertyCount = 0;
								for ( var name in object )
								{
									if ( name.startsWith( '$' ) )
									{
										continue;
									}
									if ( name === _serverTypeFieldName && propertyCount !== 0 )
									{
										properties[ propertyCount++ ] = properties[ 0 ];
										properties[ 0 ] = name;
									}
									else
									{
										properties[ propertyCount++ ] = name;
									}
								}
								if ( sort ) properties.sort();
								stringBuilder.append( '{' );
								var needComma = false;

								for ( i = 0; i < propertyCount; i++ )
								{
									var value = object[ properties[ i ] ];
									if ( typeof value !== 'undefined' && typeof value !== 'function' )
									{
										if ( needComma )
										{
											stringBuilder.append( ',' );
										}
										else
										{
											needComma = true;
										}

										_serializeWithBuilder( properties[ i ], stringBuilder, sort, prevObjects );
										stringBuilder.append( ':' );
										_serializeWithBuilder( value, stringBuilder, sort, prevObjects );

									}
								}
								stringBuilder.append( '}' );
							}
						}
						finally
						{
							Array.removeAt( prevObjects, prevObjects.length - 1 );
						}
					}
					else
					{
						stringBuilder.append( 'null' );
					}
					break;
				case 'number':
					_serializeNumberWithBuilder( object, stringBuilder );
					break;
				case 'string':
					_serializeStringWithBuilder( object, stringBuilder );
					break;
				case 'boolean':
					_serializeBooleanWithBuilder( object, stringBuilder );
					break;
				default:
					stringBuilder.append( 'null' );
					break;
			}
		}
	}
}