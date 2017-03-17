
declare global
{
    interface ObjectConstructor
    {
        getType( instance: any ): Function;
        getTypeName( instance: any ): string;
    }
}

Object.getType = ( instance: any ) =>
{
    let ctor = instance.constructor;
    if ( !ctor || ( typeof( ctor ) !== "function" ) )
    {
        return Object;
    }
    return ctor;
}

Object.getTypeName = ( instance: any ) =>
{
    let constructorString = instance.constructor.toString();
    return constructorString.match( /\w+/g )[1]; 
}

export {}

