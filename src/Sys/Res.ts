namespace Sys
{
    /**
     * Provides static, culture-neutral exception messages that are used by the Microsoft Ajax Library framework.
     */
    export const Res = {
        'argumentTypeName': 'Value is not the name of an existing type.',
        'cantBeCalledAfterDispose': 'Can\'t be called after dispose.',
        'componentCantSetIdAfterAddedToApp': 'The id property of a component can\'t be set after it\'s been added to the Appli' +
            'cation object.',
        'behaviorDuplicateName': 'A behavior with name \'{0}\' already exists or it is the name of an existing pro' +
            'perty on the target element.',
        'notATypeName': 'Value is not a valid type name.',
        'elementNotFound': 'An element with id \'{0}\' could not be found.',
        'stateMustBeStringDictionary': 'The state object can only have null and string fields.',
        'boolTrueOrFalse': 'Value must be \'true\' or \'false\'.',
        'scriptLoadFailedNoHead': 'ScriptLoader requires pages to contain a <head> element.',
        'stringFormatInvalid': 'The format string is invalid.',
        'referenceNotFound': 'Component \'{0}\' was not found.',
        'enumReservedName': '\'{0}\' is a reserved name that can\'t be used as an enum value name.',
        'circularParentChain': 'The chain of control parents can\'t have circular references.',
        'namespaceContainsNonObject': 'Object {0} already exists and is not an object.',
        'undefinedEvent': '\'{0}\' is not an event.',
        'propertyUndefined': '\'{0}\' is not a property or an existing field.',
        'observableConflict': 'Object already contains a member with the name \'{0}\'.',
        'historyCannotEnableHistory': 'Cannot set enableHistory after initialization.',
        'eventHandlerInvalid': 'Handler was not added through the Sys.UI.DomEvent.addHandler method.',
        'scriptLoadFailedDebug': 'The script \'{0}\' failed to load. Check for:\r\n Inaccessible path.\r\n Script ' +
            'errors. (IE) Enable \'Display a notification about every script error\' under ad' +
            'vanced settings.',
        'propertyNotWritable': '\'{0}\' is not a writable property.',
        'enumInvalidValueName': '\'{0}\' is not a valid name for an enum value.',
        'controlAlreadyDefined': 'A control is already associated with the element.',
        'addHandlerCantBeUsedForError': 'Can\'t add a handler for the error event using this method. Please set the windo' +
            'w.onerror property instead.',
        'cantAddNonFunctionhandler': 'Can\'t add a handler that is not a function.',
        'invalidNameSpace': 'Value is not a valid namespace identifier.',
        'notAnInterface': 'Value is not a valid interface.',
        'eventHandlerNotFunction': 'Handler must be a function.',
        'propertyNotAnArray': '\'{0}\' is not an Array property.',
        'namespaceContainsClass': 'Object {0} already exists as a class, enum, or interface.',
        'typeRegisteredTwice': 'Type {0} has already been registered. The type may be defined multiple times or ' +
            'the script file that defines it may have already been loaded. A possible cause i' +
            's a change of settings during a partial update.',
        'cantSetNameAfterInit': 'The name property can\'t be set on this object after initialization.',
        'historyMissingFrame': 'For the history feature to work in IE, the page must have an iFrame element with' +
            ' id \'__historyFrame\' pointed to a page that gets its title from the \'title\' ' +
            'query string parameter and calls Sys.Application._onIFrameLoad() on the parent w' +
            'indow. This can be done by setting EnableHistory to true on ScriptManager.',
        'appDuplicateComponent': 'Two components with the same id \'{0}\' can\'t be added to the application.',
        'historyCannotAddHistoryPointWithHistoryDisabled': 'A history point can only be added if enableHistory is set to true.',
        'baseNotAClass': 'Value is not a class.',
        'expectedElementOrId': 'Value must be a DOM element or DOM element Id.',
        'methodNotFound': 'No method found with name \'{0}\'.',
        'arrayParseBadFormat': 'Value must be a valid string representation for an array. It must start with a ' +
            '\'[\' and end with a \']\'.',
        'stateFieldNameInvalid': 'State field names must not contain any \'=\' characters.',
        'cantSetId': 'The id property can\'t be set on this object.',
        'stringFormatBraceMismatch': 'The format string contains an unmatched opening or closing brace.',
        'enumValueNotInteger': 'An enumeration definition can only contain integer values.',
        'propertyNullOrUndefined': 'Cannot set the properties of \'{0}\' because it returned a null value.',
        'argumentDomNode': 'Value must be a DOM element or a text node.',
        'componentCantSetIdTwice': 'The id property of a component can\'t be set more than once.',
        'createComponentOnDom': 'Value must be null for Components that are not Controls or Behaviors.',
        'createNotComponent': '{0} does not derive from Sys.Component.',
        'createNoDom': 'Value must not be null for Controls and Behaviors.',
        'cantAddWithoutId': 'Can\'t add a component that doesn\'t have an id.',
        'urlTooLong': 'The history state must be small enough to not make the url larger than {0} chara' +
            'cters.',
        'notObservable': 'Instances of type \'{0}\' cannot be observed.',
        'badTypeName': 'Value is not the name of the type being registered or the name is a reserved wor' +
            'd.',
        'argumentInteger': 'Value must be an integer.',
        'invokeCalledTwice': 'Cannot call invoke more than once.',
        'webServiceFailed': 'The server method \'{0}\' failed with the following error: {1}',
        'argumentType': 'Object cannot be converted to the required type.',
        'argumentNull': 'Value cannot be null.',
        'scriptAlreadyLoaded': 'The script \'{0}\' has been referenced multiple times. If referencing Microsoft ' +
            'AJAX scripts explicitly, set the MicrosoftAjaxMode property of the ScriptManager' +
            ' to Explicit.',
        'scriptDependencyNotFound': 'The script \'{0}\' failed to load because it is dependent on script \'{1}\'.',
        'formatBadFormatSpecifier': 'Format specifier was invalid.',
        'requiredScriptReferenceNotIncluded': '\'{0}\' requires that you have included a script reference to \'{1}\'.',
        'webServiceFailedNoMsg': 'The server method \'{0}\' failed.',
        'argumentDomElement': 'Value must be a DOM element.',
        'invalidExecutorType': 'Could not create a valid Sys.Net.WebRequestExecutor from: {0}.',
        'cannotCallBeforeResponse': 'Cannot call {0} when responseAvailable is false.',
        'actualValue': 'Actual value was {0}.',
        'enumInvalidValue': '\'{0}\' is not a valid value for enum {1}.',
        'scriptLoadFailed': 'The script \'{0}\' could not be loaded.',
        'parameterCount': 'Parameter count mismatch.',
        'cannotDeserializeEmptyString': 'Cannot deserialize empty string.',
        'formatInvalidString': 'Input string was not in a correct format.',
        'invalidTimeout': 'Value must be greater than or equal to zero.',
        'cannotAbortBeforeStart': 'Cannot abort when executor has not started.',
        'argument': 'Value does not fall within the expected range.',
        'cannotDeserializeInvalidJson': 'Cannot deserialize. The data does not correspond to valid JSON.',
        'invalidHttpVerb': 'httpVerb cannot be set to an empty or null string.',
        'nullWebRequest': 'Cannot call executeRequest with a null webRequest.',
        'cannotSerializeNonFiniteNumbers': 'Cannot serialize non finite numbers.',
        'argumentUndefined': 'Value cannot be undefined.',
        'webServiceInvalidReturnType': 'The server method \'{0}\' returned an invalid type. Expected type: {1}',
        'servicePathNotSet': 'The path to the web service has not been set.',
        'argumentTypeWithTypes': 'Object of type \'{0}\' cannot be converted to type \'{1}\'.',
        'cannotCallOnceStarted': 'Cannot call {0} once started.',
        'badBaseUrl1': 'Base URL does not contain ://.',
        'badBaseUrl2': 'Base URL does not contain another /.',
        'badBaseUrl3': 'Cannot find last / in base URL.',
        'setExecutorAfterActive': 'Cannot set executor after it has become active.',
        'paramName': 'Parameter name: {0}',
        'nullReferenceInPath': 'Null reference while evaluating data path: \'{0}\'.',
        'cannotCallOutsideHandler': 'Cannot call {0} outside of a completed event handler.',
        'cannotSerializeObjectWithCycle': 'Cannot serialize object with cyclic reference within child properties.',
        'format': 'One of the identified items was in an invalid format.',
        'assertFailedCaller': 'Assertion Failed: {0}\r\nat {1}',
        'argumentOutOfRange': 'Specified argument was out of the range of valid values.',
        'webServiceTimedOut': 'The server method \'{0}\' timed out.',
        'notImplemented': 'The method or operation is not implemented.',
        'assertFailed': 'Assertion Failed: {0}',
        'invalidOperation': 'Operation is not valid due to the current state of the object.',
        'breakIntoDebugger': '{0}\r\n\r\nBreak into debugger?'
    };
}