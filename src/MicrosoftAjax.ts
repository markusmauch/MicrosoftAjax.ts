
import { ArrayExtensions } from "./Array"
import { ErrorExtensions } from "./Error"
import { FunctionExtensions } from "./Function"
import { ObjectExtensions } from "./Object"
import { StringExtensions } from "./String"
import { Application } from "./Sys/Application"
import { Res } from "./Sys/Res"
import { StringBuilder } from "./Sys/StringBuilder"

ArrayExtensions();
ErrorExtensions();
FunctionExtensions();
ObjectExtensions();
StringExtensions();

export
{
    Application,
    Res,
    StringBuilder
}