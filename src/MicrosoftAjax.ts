
import { ArrayExtensions } from "./Array"
import { ErrorExtensions } from "./Error"
import { FunctionExtensions } from "./Function"
import { ObjectExtensions } from "./Object"
import { StringExtensions } from "./String"
import { Application } from "./Sys/Application"
import { ApplicationLoadEventArgs } from "./Sys/ApplicationLoadEventArgs"
import { Browser } from "./Sys/Browser"
import { CancelEventArgs } from "./Sys/CancelEventArgs"
import { Component } from "./Sys/Component"
import { CultureInfo } from "./Sys/CultureInfo"
import { EventArgs } from "./Sys/EventArgs"
import { EventHandlerList } from "./Sys/EventHandlerList"
import { HistoryEventArgs } from "./Sys/HistoryEventArgs"
import { Res } from "./Sys/Res"
import { StringBuilder } from "./Sys/StringBuilder"
import { JavaScriptSerializer } from "./Sys/Serialization/JavaScriptSerializer"
import { Behavior } from "./Sys/UI/Behavior"
import { Bounds } from "./Sys/UI/Bounds"
import { Control } from "./Sys/UI/Control"
import { DomElement } from "./Sys/UI/DomElement"
import { DomEvent } from "./Sys/UI/DomEvent"
import { Key } from "./Sys/UI/Key"
import { MouseButton } from "./Sys/UI/MouseButton"
import { Point } from "./Sys/UI/Point"
import { VisibilityMode } from "./Sys/UI/VisibilityMode"

ArrayExtensions();
ErrorExtensions();
FunctionExtensions();
ObjectExtensions();
StringExtensions();

let Serialization = {
    JavaScriptSerializer: JavaScriptSerializer
};

let UI = {
    Behavior: Behavior,
    Bounds: Bounds,
    Control: Control,
    DomElement: DomElement,
    DomEvent: DomEvent,
    Key: Key,
    MouseButton: MouseButton,
    Point: Point,
    BehavVisibilityModeior: VisibilityMode,
};


export // Sys
{
    Application,
    ApplicationLoadEventArgs,
    Browser,
    CancelEventArgs,
    Component,
    CultureInfo,
    EventArgs,
    EventHandlerList,
    HistoryEventArgs,
    Res,
    StringBuilder,
    Serialization,
    UI,
}